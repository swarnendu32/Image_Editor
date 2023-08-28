import React, { useRef, useEffect } from "react";

interface WebGLCanvasProps {
    imageUrl: string;
    brightness: number;
    contrast: number;
    sharpen: number;
    warmth: number;
    tint: number;
    shadow: number;
    saturation: number;
    highlight: number;
    exposure: number;
    greyScale: boolean;
    redChannelWeight: number;
    greenChannelWeight: number;
    blueChannelWeight: number;
}

const Canvas: React.FC<WebGLCanvasProps> = ({
    imageUrl,
    brightness,
    contrast,
    sharpen,
    warmth,
    tint,
    shadow,
    saturation,
    highlight,
    exposure,
    greyScale,
    redChannelWeight,
    greenChannelWeight,
    blueChannelWeight,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        function setRectangle(
            gl: WebGLRenderingContext,
            x: number,
            y: number,
            width: number,
            height: number
        ) {
            var x1 = x;
            var x2 = x + width;
            var y1 = y;
            var y2 = y + height;
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([
                    x1,
                    y1,
                    x2,
                    y1,
                    x1,
                    y2,
                    x1,
                    y2,
                    x2,
                    y1,
                    x2,
                    y2,
                ]),
                gl.STATIC_DRAW
            );
        }

        function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
            // Lookup the size the browser is displaying the canvas in CSS pixels.
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;

            // Check if the canvas is not the same size.
            const needResize =
                canvas.width !== displayWidth ||
                canvas.height !== displayHeight;

            if (needResize) {
                // Make the canvas the same size
                canvas.width = displayWidth * 5.46;
                canvas.height = displayHeight * 5.5;
            }

            return needResize;
        }

        const image = new Image();
        image.src = imageUrl;
        image.crossOrigin = "anonymous";
        image.onload = () => {
            // Vertex shader
            const vsSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            uniform vec2 u_resolution;
            varying vec2 texCoords;
            void main() {
                vec2 zeroToOne = a_position / u_resolution;
                vec2 zeroToTwo = zeroToOne * 2.0;
                vec2 clipSpace = zeroToTwo - 1.0;
                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
                texCoords = a_texCoord;
            }
            `;

            const fsSource = `
            precision highp float;

            varying vec2 texCoords;
            uniform sampler2D textureSampler;
            uniform vec2 sourceSize;
            uniform float brightness;
            uniform float contrast;
            uniform float sharpen;
            uniform float tint;
            uniform float warmth;
            uniform float shadow;
            uniform float saturation;
            uniform float highlight;
            uniform float exposure;
            uniform float blur;
            uniform float greyScale;
            uniform float redChannelWeight;
            uniform float greenChannelWeight;
            uniform float blueChannelWeight;
            vec3 saturationVector = vec3(0.299, 0.587, 0.114);
            const float maxBrightness = 1.0;
            const float sigma = 0.2;
            float gaussian(float x) {
                return exp(-(x * x) / (2.0 * sigma * sigma));
            }

            void main() {
                vec2 off = sourceSize * blur;
                vec2 off2 = off * 2.0;

                // Sharpness
                vec4 tex00 = texture2D(textureSampler, texCoords + vec2(-off2.x, -off2.y));
                vec4 tex10 = texture2D(textureSampler, texCoords + vec2(-off.x, -off2.y));
                vec4 tex20 = texture2D(textureSampler, texCoords + vec2(0.0, -off2.y));
                vec4 tex30 = texture2D(textureSampler, texCoords + vec2(off.x, -off2.y));
                vec4 tex40 = texture2D(textureSampler, texCoords + vec2(off2.x, -off2.y));

                vec4 tex01 = texture2D(textureSampler, texCoords + vec2(-off2.x, -off.y));
                vec4 tex11 = texture2D(textureSampler, texCoords + vec2(-off.x, -off.y));
                vec4 tex21 = texture2D(textureSampler, texCoords + vec2(0.0, -off.y));
                vec4 tex31 = texture2D(textureSampler, texCoords + vec2(off.x, -off.y));
                vec4 tex41 = texture2D(textureSampler, texCoords + vec2(off2.x, -off.y));

                vec4 tex02 = texture2D(textureSampler, texCoords + vec2(-off2.x, 0.0));
                vec4 tex12 = texture2D(textureSampler, texCoords + vec2(-off.x, 0.0));
                vec4 tex22 = texture2D(textureSampler, texCoords + vec2(0.0, 0.0));
                vec4 tex32 = texture2D(textureSampler, texCoords + vec2(off.x, 0.0));
                vec4 tex42 = texture2D(textureSampler, texCoords + vec2(off2.x, 0.0));

                vec4 tex03 = texture2D(textureSampler, texCoords + vec2(-off2.x, off.y));
                vec4 tex13 = texture2D(textureSampler, texCoords + vec2(-off.x, off.y));
                vec4 tex23 = texture2D(textureSampler, texCoords + vec2(0.0, off.y));
                vec4 tex33 = texture2D(textureSampler, texCoords + vec2(off.x, off.y));
                vec4 tex43 = texture2D(textureSampler, texCoords + vec2(off2.x, off.y));

                vec4 tex04 = texture2D(textureSampler, texCoords + vec2(-off2.x, off2.y));
                vec4 tex14 = texture2D(textureSampler, texCoords + vec2(-off.x, off2.y));
                vec4 tex24 = texture2D(textureSampler, texCoords + vec2(0.0, off2.y));
                vec4 tex34 = texture2D(textureSampler, texCoords + vec2(off.x, off2.y));
                vec4 tex44 = texture2D(textureSampler, texCoords + vec2(off2.x, off2.y));
                
                vec4 tex = tex22;
                vec4 blurred = 1.0 * tex00 + 4.0 * tex10 + 6.0 * tex20 + 4.0 * tex30 + 1.0 * tex40 + 4.0 * tex01 + 16.0 * tex11 + 24.0 * tex21 + 16.0 * tex31 + 4.0 * tex41 + 6.0 * tex02 + 24.0 * tex12 + 36.0 * tex22 + 24.0 * tex32 + 6.0 * tex42 + 4.0 * tex03 + 16.0 * tex13 + 24.0 * tex23 + 16.0 * tex33 + 4.0 * tex43 + 1.0 * tex04 + 4.0 * tex14 + 6.0 * tex24 + 4.0 * tex34 + 1.0 * tex44;
                blurred /= 256.0;

                tex += (tex - blurred) * sharpen;

                // Saturation
                vec3 desaturated = vec3(dot(saturationVector, tex.rgb));
                vec3 mixed = mix(desaturated, tex.rgb, saturation);
                vec4 color = vec4(mixed, tex.a);

                // Warmth
                color.r += warmth;
                color.b -= warmth;

                // Contrast
                color.rgb = (color.rgb - 0.5) * contrast + 0.5;

                // Brightness
                vec3 texColor = color.rgb;
                float luminance = dot(texColor, saturationVector);
                float adjustment = 1.0 + brightness * gaussian(luminance - 0.5);
                vec3 adjustedColor = texColor * adjustment * maxBrightness;
                color.rgb = clamp(adjustedColor, 0.0, 1.0);

                // Exposure
                color.rgb = color.rgb * pow(2.0, exposure);

                // Highlight
                float highlightAdjustment = pow(luminance, highlight);
                color.rgb *= highlightAdjustment;

                // Shadow
                float colorValue = sqrt(pow(color.r, 2.0) + pow(color.g, 2.0) + pow(color.b, 2.0));
                float canvasColorSpace = colorValue / sqrt(pow(255.0, 2.0) + pow(255.0, 2.0) + pow(255.0, 2.0));
                if(canvasColorSpace < 0.5) {
                    adjustedColor = vec3(color.r + shadow, color.g + shadow, color.b + shadow);
                }
                color.rgb = clamp(adjustedColor, 0.0, 1.0);

                // Tint
                float redTint = 0.0;
                float greenTint = 0.0;
                if (tint > 0.0) {
                    redTint = tint;
                } else if (tint < 0.0) {
                    greenTint = -tint;
                }
                color.r += redTint;
                color.g += greenTint;
                color.b += (redTint - greenTint) / 2.0;
                color.rgb = clamp(color.rgb, 0.0, 1.0);

                // GreyScale
                if(greyScale == 1.0){
                    color.rgb = vec3(color.r*redChannelWeight + color.g*greenChannelWeight + color.b*blueChannelWeight);
                }
                gl_FragColor = color;
            }
            `;

            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

            if (!vertexShader || !fragmentShader) {
                console.error("Failed to create shaders");
                return;
            }

            gl.shaderSource(vertexShader, vsSource);
            gl.shaderSource(fragmentShader, fsSource);

            gl.compileShader(vertexShader);
            gl.compileShader(fragmentShader);

            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                console.error(
                    "Vertex shader compilation error",
                    gl.getShaderInfoLog(vertexShader)
                );
                return;
            }

            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                console.error(
                    "Fragment shader compilation error",
                    gl.getShaderInfoLog(fragmentShader)
                );
                return;
            }

            const shaderProgram = gl.createProgram();
            if (!shaderProgram) {
                console.error("Failed to create shader program");
                return;
            }
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);

            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                console.error(
                    "Shader program linking error",
                    gl.getProgramInfoLog(shaderProgram)
                );
                return;
            }

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            setRectangle(gl, 0, 0, image.width, image.height);

            let texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([
                    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
                ]),
                gl.STATIC_DRAW
            );

            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                gl.CLAMP_TO_EDGE
            );
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                gl.CLAMP_TO_EDGE
            );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                image
            );
            resizeCanvasToDisplaySize(canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(shaderProgram);

            var positionLocation = gl.getAttribLocation(
                shaderProgram,
                "a_position"
            );
            var texCoordLocation = gl.getAttribLocation(
                shaderProgram,
                "a_texCoord"
            );
            var resolutionLocation = gl.getUniformLocation(
                shaderProgram,
                "u_resolution"
            );

            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(texCoordLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

            const brightnessLocation = gl.getUniformLocation(
                shaderProgram,
                "brightness"
            );
            gl.uniform1f(brightnessLocation, brightness / 200);

            const contrastLocation = gl.getUniformLocation(
                shaderProgram,
                "contrast"
            );
            gl.uniform1f(contrastLocation, contrast / 150 + 0.999);

            const sourceSizeLocation = gl.getUniformLocation(
                shaderProgram,
                "sourceSize"
            );
            gl.uniform2fv(
                sourceSizeLocation,
                new Float32Array([1 / image.width, 1 / image.height])
            );

            const blurLocation = gl.getUniformLocation(shaderProgram, "blur");
            gl.uniform1f(blurLocation, (canvas.height / image.height) * 1.0);

            const sharpnessLocation = gl.getUniformLocation(
                shaderProgram,
                "sharpen"
            );
            gl.uniform1f(sharpnessLocation, sharpen / 50);

            const warmthLocation = gl.getUniformLocation(
                shaderProgram,
                "warmth"
            );
            gl.uniform1f(warmthLocation, warmth / 500);

            const hueLocation = gl.getUniformLocation(shaderProgram, "tint");
            gl.uniform1f(hueLocation, tint / 1000);

            const shadowLocation = gl.getUniformLocation(
                shaderProgram,
                "shadow"
            );
            gl.uniform1f(shadowLocation, shadow / 800);

            const saturationLocation = gl.getUniformLocation(
                shaderProgram,
                "saturation"
            );
            gl.uniform1f(saturationLocation, saturation / 100 + 1);

            const highlightLocation = gl.getUniformLocation(
                shaderProgram,
                "highlight"
            );
            gl.uniform1f(highlightLocation, -highlight / 500);

            const exposureLocation = gl.getUniformLocation(
                shaderProgram,
                "exposure"
            );
            gl.uniform1f(exposureLocation, exposure / 200);

            const greyScaleLocation = gl.getUniformLocation(
                shaderProgram,
                "greyScale"
            );
            gl.uniform1f(greyScaleLocation, !greyScale ? 0.0 : 1.0);

            const redChannelWeightLocation = gl.getUniformLocation(
                shaderProgram,
                "redChannelWeight"
            );
            gl.uniform1f(redChannelWeightLocation, redChannelWeight / 100);

            const greenChannelWeightLocation = gl.getUniformLocation(
                shaderProgram,
                "greenChannelWeight"
            );
            gl.uniform1f(greenChannelWeightLocation, greenChannelWeight / 100);

            const blueChannelWeightLocation = gl.getUniformLocation(
                shaderProgram,
                "blueChannelWeight"
            );
            gl.uniform1f(blueChannelWeightLocation, blueChannelWeight / 100);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };
    }, [
        imageUrl,
        brightness,
        contrast,
        sharpen,
        warmth,
        tint,
        shadow,
        saturation,
        highlight,
        exposure,
        greyScale,
        redChannelWeight,
        greenChannelWeight,
        blueChannelWeight,
    ]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%" }}
        ></canvas>
    );
};

export default Canvas;
