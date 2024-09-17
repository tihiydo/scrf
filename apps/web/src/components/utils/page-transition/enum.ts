export const PageTransitionKeys = {
    EnterTransitionType: 'etr-trstntp',
    EnterTransitionDuration: 'etr-trnstndr',
    ExitTransitionType: 'xt-trstntp',
    ExitTranistionDuration: 'xt-trnstndr',
} as const;
export type PageTransitionKeys = ObjectValues<typeof PageTransitionKeys>;

export const PageTransitionType = {
    None: 'none',
    YSlide: 'sld-y'
} as const;
export type PageTransitionType = ObjectValues<typeof PageTransitionType>;