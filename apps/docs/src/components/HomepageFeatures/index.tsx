import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  img: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    img: require("@site/static/img/blue_easy.png").default,
    description: (
      <>
        Verse was designed from the ground up to allow you to easily get your application up and
        running quickly.
      </>
    ),
  },
  {
    title: "Focus on What Matters",
    img: require("@site/static/img/blue_focus.png").default,
    description: (
      <>
        You focus on your application, and we do the heavy lifting. Write clean and safe TypeScript
        code to query and update your data.
      </>
    ),
  },
  {
    title: "Performance First",
    img: require("@site/static/img/blue_performance.png").default,
    description: (
      <>
        Verse is built with performance in mind. Full support for efficient eager loading patterns,
        async streaming reads, and more.
      </>
    ),
  },
];

function Feature({ title, img, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img className={styles.featureSvg} role="img" src={img} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
