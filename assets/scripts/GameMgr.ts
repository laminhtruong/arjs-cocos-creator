
import { _decorator, Component, Node, Mat4, Camera, Vec3, TERRAIN_HEIGHT_BASE, renderer, mat4 } from 'cc';
import ARCocos from './ARCocos';
import VideoCamera from './VideoCamera';
const { ccclass, property } = _decorator;

@ccclass('GameMgr')
export class GameMgr extends Component
{
    @property(Camera)
    camera: Camera;

    @property(Node)
    root: Node;

    videoCamera: VideoCamera = new VideoCamera();

    video: any;
    markerMatrix: Float64Array = new Float64Array(12);
    worldMatrix: Float64Array = new Float64Array(16);

    start()
    {
        // this.video = document.getElementById("video");
        // let video = this.video;
        this.videoCamera.Setup()
            .then(video =>
            {
                ARCocos.Init(video)
                    .then(response =>
                    {
                        ARCocos.SetMarker(this.camera.node, 'test.patt');
                        // this.camera.camera.matProj = ARCocos.GetProjectionMatrix();
                    })
                    .catch(error =>
                    {
                        console.log(error);
                    })

                this.video = video;
                this.video.play();
            })
    }

    update(deltaTime: number)
    {
        if (!ARCocos.IsReady() || !this.video)
        {
            return;
        }
        ARCocos.Update(this.video);
    }

    Play()
    {
        this.video.play();
    }
}
