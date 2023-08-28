// import fs from "fs";
import { Props } from "../components/CanvasFrame";
import path from "path";

export function generateFragmentShader({
    brightness,
    contrast,
    sharpness,
    shadow,
    saturation,
    exposure,
    highlight,
    warmth,
    tint,
    redChannelWeight,
    greenChannelWeight,
    blueChannelWeight,
    greyScale,
}: Props) {
    const fragmentShader = `
        precision highp float;
        varying vec2 texCoords;
        uniform sampler2D textureSampler;
        uniform vec2 sourceSize;
        uniform float blur;
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

            tex += (tex - blurred) * ${sharpness / 50};

            vec3 desaturated = vec3(dot(saturationVector, tex.rgb));
            vec3 mixed = mix(desaturated, tex.rgb, ${saturation});
            vec4 color = vec4(mixed, tex.a);

            color.r += ${warmth};
            color.b -= ${warmth};

            color.rgb = (color.rgb - 0.5) * ${contrast / 150 + 0.999} + 0.5;

            vec3 texColor = color.rgb;
            float luminance = dot(texColor, saturationVector);
            float adjustment = 1.0 + ${brightness / 200} * gaussian(luminance - 0.5);
            vec3 adjustedColor = texColor * adjustment * maxBrightness;
            color.rgb = clamp(adjustedColor, 0.0, 1.0);

            color.rgb = color.rgb * pow(2.0, ${exposure});

            float highlightAdjustment = pow(luminance, ${highlight});
            color.rgb *= highlightAdjustment;

            float colorValue = sqrt(pow(color.r, 2.0) + pow(color.g, 2.0) + pow(color.b, 2.0));
            float canvasColorSpace = colorValue / sqrt(pow(255.0, 2.0) + pow(255.0, 2.0) + pow(255.0, 2.0));
            if(canvasColorSpace < 0.5) {
                adjustedColor = vec3(color.r + ${shadow}, color.g + ${shadow}, color.b + ${shadow});
            }
            color.rgb = clamp(adjustedColor, 0.0, 1.0);

            float redTint = 0.0;
            float greenTint = 0.0;
            if (tint > 0.0) {
                redTint = ${tint};
            } else if (tint < 0.0) {
                greenTint = -${tint};
            }
            color.r += redTint;
            color.g += greenTint;
            color.b += (redTint - greenTint) / 2.0;
            color.rgb = clamp(color.rgb, 0.0, 1.0);

            if(${greyScale}){
                color.rgb = vec3(color.r * ${redChannelWeight} + color.g * ${greenChannelWeight} + color.b * ${blueChannelWeight});
            }
            
            gl_FragColor = color;
        }
    `;

    // const folderPath = path.join(__dirname, "filters");
    // if (!fs.existsSync(folderPath)) {
    //     fs.mkdirSync(folderPath);
    // }
    // const filePath = path.join(folderPath, 'generatedShader.glsl');
    // fs.writeFileSync(filePath, fragmentShader, 'utf-8');
    console.log(fragmentShader)
}
