import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { Personality } from "@/entities/pesonality";
import styles from "./actor-card.module.scss";
import screenifyFallback from '@/assets/images/fallback.png'
import { PictureFallback, PictureImage, PictureRoot } from "@/components/ui/picture";

const ActorCard = ({ actor }: { actor: Personality }) => {
  const router = useRouter();

  const handleReadMoreClick = () => {
    router.push(`/actor/${actor.imdbid}`);
  };

  return (
    <div className={styles.actor}>
      <PictureRoot>
        <PictureImage
          src={actor.photoUrl || ""}
          alt={`${actor.personName}'s photo`}
          width={266}
          height={260}
          className={styles.actor__image}
        />

        <PictureFallback>
          <Image
            src={screenifyFallback}
            alt={`${actor.personName}'s photo`}
            width={266}
            height={260}
          />
        </PictureFallback>
      </PictureRoot>
      <div
        onClick={handleReadMoreClick}
        className={styles.actor__overlay}>
        <Button
          variant="accent-outline"
          className={styles.actor__readButton}
          onClick={handleReadMoreClick}
        >
          Read more
        </Button>
      </div>
      <p className={styles.actor__name}>{actor.personName}</p>
    </div>
  );
};


export default ActorCard