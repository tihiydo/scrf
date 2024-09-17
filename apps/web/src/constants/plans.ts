export type Plan = {
    name: string;
    movies: number;
    shows: number;
    series: number;
    devicesCount: number;
    trialWeeks: number;
    weeklyPay: number;
}

export const PlanKind = {
    Starter: 'starter',
    Medium: 'medium',
    Premium: 'premium',
} as const;
export type PlanKind = ObjectValues<typeof PlanKind>


export const plans: Record<PlanKind, Plan> = {
    [PlanKind.Starter]: {
        name: 'Started Plan',
        movies: 100_000,
        shows: 90_000,
        series: 150_000,
        devicesCount: 2,
        trialWeeks: 1,
        weeklyPay: 2
    },
    [PlanKind.Medium]: {
        name: 'Medium Plan',
        movies: 100_000,
        shows: 90_000,
        series: 150_000,
        devicesCount: 5,
        trialWeeks: 2,
        weeklyPay: 3
    },

    [PlanKind.Premium]: {
        name: 'Premium Plan',
        movies: 100_000,
        shows: 90_000,
        series: 150_000,
        devicesCount: 8,
        trialWeeks: 3,
        weeklyPay: 4
    },
}