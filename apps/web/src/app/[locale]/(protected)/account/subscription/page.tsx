"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import classnames from "classnames";
import { observer } from "mobx-react-lite";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { sessionStore } from "@/session/session.store";
import { AxiosInternalApiError } from "@/types";
import { Subscriptions } from "@/entities/user";

import styles from "./page.module.scss";
import { apiClient } from "@/app/api/client";
import { GetSubscriptionHistory } from "@/api/requests/subscription/history";
import { SubscriptionHistory } from "./_components/subscription-history";
import { Accordion } from "./_components/accordion";
import { calculateDaysFrom } from "@/utils/time";
import WrapperBlock from "@/components/wrapper-block/wrapper-block";
import { BreadCrumbs } from "@/components/ui/bread-crumbs";
import classNames from "classnames";

const PLANS = [
	{
		title: "Starter Plan",
		value: "base" as keyof typeof Subscriptions,
		ratedMovies: 100000,
		trendingSeries: 90000,
		quality: "FULL HD and 4K Quality",
		view: "2 devices, NO ADS",
		perMonth: "2$",
	},
	{
		title: "Medium Plan",
		value: "middle" as keyof typeof Subscriptions,
		ratedMovies: 100000,
		trendingSeries: 90000,
		quality: "FULL HD and 4K Quality",
		view: "5 devices, NO ADS",
		perMonth: "3$",
	},
	{
		title: "Premium Plan",
		value: "pro" as keyof typeof Subscriptions,
		ratedMovies: 100000,
		trendingSeries: 90000,
		quality: "HD, Full HD AND 4K",
		view: "8 devices, NO ADS",
		perMonth: "4$",
	}
];

type AccordionState = {
	plans: boolean;
	history: boolean;
	[key: string]: boolean;
};


function SubscriptionPage() {
	const [isOpenAccordion, setIsOpenAccordion] = useState<AccordionState>({
		plans: false,
		history: false,
	});
	const getSubscriptionHistoryQuery = useQuery({
		queryKey: GetSubscriptionHistory.queryKeys,
		queryFn: async () => {
			const response = await apiClient<GetSubscriptionHistory.Response>(GetSubscriptionHistory.config)

			return response.data;
		},
	});


	const [canFree, setCanFree] = useState<boolean>(true);
	const canBeFree = async () => {
		try {
			const response = await apiClient.get("/subscriptions/can-buy-free");
			if (response.status === 200 && typeof response.data === 'boolean') {
				setCanFree(response.data);
			} else {
				console.error('Unexpected response data:', response.data);
			}
		} catch (error) {
			console.error('Failed to fetch subscription status:', error);
		}
	};

	useEffect(() => {
		canBeFree();
		console.log(canFree)
	}, []);

	const handleActionAccordion = (key: keyof AccordionState) => {
		setIsOpenAccordion((prevState) => {
			const newState = Object.keys(prevState).reduce((acc, currentKey) => {
				acc[currentKey] = currentKey === key ? !prevState[key] : false;
				return acc;
			}, {} as AccordionState);

			return newState;
		});
	};

	const buySubscriptionMutation = useMutation({
		mutationFn: (subscription: Subscriptions) => {
			return apiClient.patch(
				`/users/update-subscription/${sessionStore.user?.id}`,
				{
					subscription,
				}
			);
		},
		onSuccess: (response) => {
			sessionStore.loadUser();
		},
		onError: (_: AxiosInternalApiError) => { },
	});


	const isActiveSubscription = sessionStore.user?.currentSubscription &&
		sessionStore.user.subscriptionExpired


	const isBuyButtonDisabled = (plan: keyof typeof Subscriptions) => {
		if (sessionStore.user?.currentSubscription) {
			return true
		}

		return false;
	};

	const getPlanDescription = () => {
		if (isActiveSubscription) {
			return "Full access, email notifications and more";
		} else if (
			sessionStore.user?.currentSubscription &&
			!sessionStore.user?.subscriptionExpired
		) {
			return "Your request is being processed, please wait until it is accepted and you get all access";
		}
		return "To access the main features of Screenify, please subscribe to one of our available plans.";
	}

	const getPlanButtonTitle = (label: string) => {

		const currentSubscription = sessionStore.user?.currentSubscription;
		const isLabelMatchingSubscription =
			label === Subscriptions[currentSubscription!];

		if (isActiveSubscription && isLabelMatchingSubscription) {
			return "Active";
		}


		if (
			currentSubscription &&
			!sessionStore.user?.subscriptionExpired &&
			isLabelMatchingSubscription
		) {
			return "In process";
		}

		if (!currentSubscription && canFree) {
			return "TRY FOR FREE"
		}

		if (currentSubscription) {
			return "Can't buy"
		}

		return "Buy";
	}


	return (
		<div className={styles.subscription}>
			<h3 className={styles.subscription__title}>subscription</h3>
			<div className={styles.subscription__content}>
				<WrapperBlock className={styles.subscription__currentPlan}>
					<div className={styles.subscription__currentPlan__header}>
						<h4>
							{isActiveSubscription
								? `${Subscriptions[sessionStore.user?.currentSubscription!]} plan`
								: "No plan"}
						</h4>
						{isActiveSubscription && (
							<p>{`${calculateDaysFrom(sessionStore.user?.subscriptionExpired!)} days left`}</p>
						)}
					</div>
					<p className={styles.subscription__currentPlan__description}>
						{getPlanDescription()}
					</p>
				</WrapperBlock>
				<Accordion
					isOpen={isOpenAccordion.plans}
					title="Change plan"
					handleOpen={() => handleActionAccordion("plans")}
				>
					<div className={styles.subscription__plans}>
						{PLANS.map((plan) => {
							return (
								<WrapperBlock className={styles.subscription__plan} key={plan.title}>
									<h3>{plan.title}</h3>
									<div className={styles.subscription__plan__content}>
										<div className={styles.subscription__plan__description}>
											<div className={styles.subscription__plan__descriptionItem}>
												<p>
													<span>{plan.ratedMovies}</span>
													{"+  "}rated movies
												</p>
												<p>
													<span>{plan.trendingSeries}</span>
													{"+  "}trending series
												</p>
												<div className={styles.subscription__plan__buy}>
													<p>{plan.perMonth} / month</p>
													<Button
														variant={
															isBuyButtonDisabled(plan.value)
																? "accent-outline"
																: "pimary"
														}
														className={classnames(
															isBuyButtonDisabled(plan.value) ? styles.disabled : '',
														)}
														onClick={() =>
															buySubscriptionMutation.mutate(
																Subscriptions[plan.value]
															)
														}
														disabled={buySubscriptionMutation.isPending}
													>
														{getPlanButtonTitle(plan.value)}
													</Button>
												</div>
											</div>
											<div className={styles.subscription__plan__descriptionItem}>
												<p>
													<span>{plan.quality}</span>
													{"  "}quality
												</p>
												<p>
													View from{"  "}
													<span>{plan.view}</span>
												</p>

											</div>
										</div>
									</div>
								</WrapperBlock>
							)
						})}
					</div>
				</Accordion>
				{getSubscriptionHistoryQuery.data?.history.length ? (
					<Accordion
						isOpen={isOpenAccordion.history}
						title="payment history"
						handleOpen={() => handleActionAccordion("history")}
					>
						<SubscriptionHistory history={getSubscriptionHistoryQuery.data?.history ?? []} />
					</Accordion>
				) : null}
			</div>
		</div>
	);
}

export default observer(SubscriptionPage)
