#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler;
varying highp vec2 vTextureCoord;
varying highp vec3 vColor;

vec3 toneMapping(vec3 color){
    vec3 result;

    for (int i=0; i<3; ++i) {
        if (color[i] <= 0.0031308)
            result[i] = 12.92 * color[i];
        else
            result[i] = (1.0 + 0.055) * pow(color[i], 1.0/2.4) - 0.055;
    }

    return result;
}

void main(){
  vec3 texColor = texture2D(uSampler, vTextureCoord).rgb;
  vec3 color = toneMapping(vColor); 
  gl_FragColor = vec4(color * texColor, 1.0);
}
