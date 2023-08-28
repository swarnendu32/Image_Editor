// Fragment Shader

precision highp float;

varying vec2 texCoords;
uniform sampler2D textureSampler;
uniform vec2 sourceSize;
uniform float brightness;
uniform float contrast;
uniform float sharpen;
uniform float temperature;
uniform float hue;
uniform float warmth;
uniform float shadow;
uniform float saturation;
uniform float highlight;
uniform float exposure;
uniform float vignette;
uniform float grey;
uniform float blur;

vec3 saturationVector = vec3(0.299, 0.587, 0.114);

void main() {
    vec2 off = sourceSize * blur;
    vec2 off2 = off * 2.0;

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
     // Sharpen
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

    // GreyScale
    vec3 greyVec = vec3(grey, grey, grey);

    // Brightness
    color.rgb = mix(color.rgb * brightness, mix(greyVec, color.rgb, contrast), 0.5);

    float ratio = off.x / off.y;
    float dist = sqrt(pow(texCoords.x - 0.5, 2.0) + pow(ratio * (texCoords.y - 0.5), 2.0));
    float vigCurve = exp(-pow(dist, 2.0) / (2.0 * pow(-vignette, 2.0)));

    color.rgb *= vigCurve;

    gl_FragColor = color;
}


// color.rgb = color.r*Wr + color.g*Wg + color.b*Wb