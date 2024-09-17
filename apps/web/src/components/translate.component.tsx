import { TranslationValues, useTranslations } from "next-intl"

type Props = {
  path: string | string[]
  values?: TranslationValues;
}

const Translate = ({ path, values }: Props) => {
  const translate = useTranslations();

  return translate(
    typeof path === 'string'
      ? path
      : path.join('.'),
    values
  )
}

export default Translate