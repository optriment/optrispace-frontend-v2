import { Button } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'
import setLanguage from 'next-translate/setLanguage'

export const LanguageSwitcher = () => {
  const { lang } = useTranslation('common')

  return (
    <Button.Group size="tiny" compact toggle>
      <Button
        active={lang === 'en'}
        onClick={async () => await setLanguage('en')}
        content="English"
      />

      <Button
        active={lang === 'es'}
        onClick={async () => await setLanguage('es')}
        content="Español"
      />
    </Button.Group>
  )
}
