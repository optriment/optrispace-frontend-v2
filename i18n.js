module.exports = {
  locales: ['en', 'es', 'pt'],
  defaultLocale: 'en',
  pages: {
    '*': ['common'],
    '/jobs': ['jobs'],
    '/jobs/[id]': ['jobs', 'applications'],
    '/jobs/[id]/contracts/new': ['contracts'],
    '/jobs/new': ['jobs'],
    '/customer/jobs': ['jobs'],
    '/customer/contracts': ['contracts'],
    '/freelancer/contracts': ['contracts'],
    '/freelancer/applications': ['jobs', 'applications'],
    '/contracts/[id]': ['contracts'],
  },
  logger: (err) => {
    console.error(`[MISSING_TRANSLATION]: ${JSON.stringify(err)}`)
  },
  loggerEnvironment: 'both',
  allowEmptyStrings: false,
}
