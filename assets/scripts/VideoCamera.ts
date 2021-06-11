import { PREVIEW } from "cc/env";

export default class VideoCamera
{
    async Setup()
    {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
        {
            throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
        }

        let video: any = document.getElementById('video');
        let options: any = {
            audio: false,
            video: {
                facingMode: 'environment',
                width: {
                    ideal: 640,
                },
                height: {
                    ideal: 480,
                }
            }
        }

        let stream = await navigator.mediaDevices.getUserMedia(options);
        if (PREVIEW)
        {
            video.src = "output_4.mp4";
        }
        else
        {
            video.srcObject = stream;
        }

        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('playsinline', 'playsinline');
        video.setAttribute('muted', '');
        video.style.width = '640px';
        video.style.height = '480px';

        return new Promise<any>((resolve, reject) =>
        {
            video.onloadedmetadata = () =>
            {
                this.Resize(video);
                resolve(video);
            };
        });
    }

    async Init()
    {
        let video = await this.Setup();
        video.play();

        return video;
    }

    Resize(video: any)
    {
        let screenWidth = window.innerWidth
        let screenHeight = window.innerHeight
        let sourceWidth = video.videoWidth
        let sourceHeight = video.videoHeight
        let sourceAspect = sourceWidth / sourceHeight
        let screenAspect = screenWidth / screenHeight

        if (screenAspect < sourceAspect)
        {
            let newWidth = sourceAspect * screenHeight
            video.style.width = newWidth + 'px'
            video.style.marginLeft = -(newWidth - screenWidth) / 2 + 'px'

            video.style.height = screenHeight + 'px'
            video.style.marginTop = '0px'
        }
        else
        {
            let newHeight = 1 / (sourceAspect / screenWidth)
            video.style.height = newHeight + 'px'
            video.style.marginTop = -(newHeight - screenHeight) / 2 + 'px'

            video.style.width = screenWidth + 'px'
            video.style.marginLeft = '0px'
        }
    }
}
