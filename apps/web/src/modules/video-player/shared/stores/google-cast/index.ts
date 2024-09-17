import { makeAutoObservable } from 'mobx';

class GoogleCastStore {
    // castState: string = window.cast?.framework?.CastState.NO_DEVICES_AVAILABLE ?? 'NO_DEVICES_AVAILABLE';
    // isAvailable: boolean = false;

    // constructor() {
    //     makeAutoObservable(this);
    //     this.checkCastSupport();
    // }

    // checkCastSupport() {
    //     if (window.chrome?.cast?.isAvailable) {
    //         this.initializeCastAPI();
    //     } else {
    //         window['__onGCastApiAvailable'] = (isAvailable: boolean) => {
    //             console.log('window cast available event', isAvailable)
    //             this.isAvailable = isAvailable;
    //             if (isAvailable) {
    //                 this.initializeCastAPI();
    //             }
    //         };
    //     }
    // }

    // initializeCastAPI() {
    //     if (!this.isAvailable) return;

    //     if (!window.cast || !window.cast.framework) {
    //         console.error("Google Cast API is not available.");
    //         return;
    //     }


    //     const castContext = window.cast.framework.CastContext.getInstance();


    //     castContext.setOptions({
    //         receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    //         autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    //     })

    //     this.castState = castContext.getCastState();
    //     this.isAvailable = true;


    //     castContext.addEventListener(
    //         window.cast.framework.CastContextEventType.CAST_STATE_CHANGED,
    //         (event) => {
    //             console.log(event.castState)
    //             this.castState = event.castState;
    //         }
    //     );
    // }

    // startCasting(videoUrl: string) {
    //     if (!this.isAvailable) {
    //         console.error("Cast is not available.");
    //         return;
    //     }

    //     const castContext = window.cast.framework.CastContext.getInstance();
    //     const session = castContext.getCurrentSession();

    //     const loadMedia = (session: cast.framework.CastSession) => {
    //         if (!session) {
    //             console.error("No active Cast session.");
    //             return;
    //         }

    //         // Create a media info object with HLS content type
    //         const mediaInfo = new window.chrome.cast.media.MediaInfo(videoUrl, 'application/x-mpegURL');

    //         const request = new window.chrome.cast.media.LoadRequest(mediaInfo);

    //         request.autoplay = true;
    //         request.currentTime = 0;

    //         session.loadMedia(request)
    //             .then(() => {
    //                 console.log('HLS media loaded successfully');
    //             })
    //             .catch((error: any) => {
    //                 console.error('Error loading HLS media:', error);
    //             });
    //     };

    //     if (session) {
    //         loadMedia(session);
    //     } else {
    //         castContext.requestSession()
    //             .then(() => {
    //                 const session = castContext.getCurrentSession();
    //                 if (!session) return;

    //                 loadMedia(session);
    //             })
    //             .catch((error: any) => {
    //                 console.error('Error requesting Cast session:', error);
    //             });
    //     }
    // }


    // stopCasting() {
    //     if (!this.isAvailable) return;

    //     const castContext = window.cast.framework.CastContext.getInstance();
    //     const session = castContext.getCurrentSession();

    //     if (session) {
    //         session.endSession(true);
    //     }
    // }
}

export const googleCastStore = new GoogleCastStore();
