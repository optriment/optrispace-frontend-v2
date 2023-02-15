const XSS_WHITELIST = {
  stripIgnoreTag: true,
  stripIgnoreTagBody: true,
  whiteList: {
    a: ['class', 'href', 'title', 'target', 'rel'],
    span: ['class'],
    p: ['class'],
    strong: [],
    b: [],
    s: [],
    br: [],
    i: [],
    u: [],
    div: [],
  },
}

export { XSS_WHITELIST }
