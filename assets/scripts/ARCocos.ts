import { Mat4, Node, Quat, Vec3, view } from "cc"

class ARCocos
{
    arController: ARController;
    projectionAxisTransformMatrix: Mat4;
    markerCallback: any;
    object3d: Node;
    markerId: number;

    constructor()
    {

    }

    Init(video: any)
    {
        return new Promise((resolve, reject) =>
        {
            let mat4Y = new Mat4();
            let mat4Z = new Mat4();

            Mat4.rotateY(mat4Y, new Mat4(), Math.PI);
            Mat4.rotateZ(mat4Z, new Mat4(), Math.PI);

            this.projectionAxisTransformMatrix = new Mat4();
            this.projectionAxisTransformMatrix.multiply(mat4Y);
            this.projectionAxisTransformMatrix.multiply(mat4Z);

            let cameraParameters = new ARCameraParam();
            cameraParameters.onload = async () =>
            {
                // init controller
                this.arController = new ARController(video.videoWidth, video.videoHeight, cameraParameters);
                this.arController.setPatternDetectionMode((<any>window).artoolkit.AR_TEMPLATE_MATCHING_MONO);
                this.arController.setMatrixCodeType((<any>window).artoolkit.AR_MATRIX_CODE_3x3);
                this.arController.setPattRatio(0.5);

                this.arController.addEventListener('getMarker', this.OnMarker.bind(this), true);
                resolve('ok');
            };
            cameraParameters.load("camera_para.dat");
        });
    }

    Update(video: any)
    {
        this.arController.process(video);
    }

    SetMarker(object3d: Node, pattern: string)
    {
        this.arController.loadMarker(pattern, (markerId: any) =>
        {
            this.markerId = markerId;
            this.arController.trackPatternMarkerId(markerId, 1);
        });
        this.object3d = object3d;
    }

    IsReady()
    {
        return this.arController;
    }

    GetProjectionMatrix()
    {
        let projectionMatrix = new Mat4();
        Mat4.fromArray(projectionMatrix, this.arController.getCameraMatrix());

        projectionMatrix.multiply(this.projectionAxisTransformMatrix);
        return projectionMatrix;
    }

    OnMarker(event: any)
    {
        if (event.data.type === (<any>window).artoolkit.PATTERN_MARKER && event.data.marker.cfPatt < 0.6)
        {
            return;
        }

        // Accept all marker for test
        // if (event.data.marker.idPatt == this.markerId)
        {
            let modelMatrix = new Mat4();

            Mat4.fromArray(modelMatrix, event.data.matrix)
            modelMatrix = this.projectionAxisTransformMatrix.clone().multiply(modelMatrix);

            let mat4X = new Mat4();
            Mat4.rotateX(mat4X, new Mat4(), Math.PI / 2);
            modelMatrix.multiply(mat4X)

            let invertMatrix = new Mat4();
            Mat4.invert(invertMatrix, modelMatrix);

            this.object3d.matrix = invertMatrix;
        }
    }
}

export default new ARCocos;