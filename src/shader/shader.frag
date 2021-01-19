uniform vec2 iResolution;
uniform float iTime;
uniform float iX;
uniform float iY;
uniform float iZ;
uniform float iQ;

void main() {
  
  float f = fract(iTime);
  vec2 v = iResolution.xy;
  vec2 p = gl_FragCoord.xy;

  p = (p-v*.5)*.4 / v.y;
  p += p * sin(dot(p, p)*20.-iTime*0.2) * iX * 0.1;

  gl_FragColor *= 0.;
  for (float i = .5 ; i < 8. ; i++){
    p = abs(2.*fract(p-.5)-1.) * mat2(cos(.01*(iTime*0.2+iTime)*i*i + .78*vec4(1,7,3,1)));
    gl_FragColor += exp(-abs(p.y)*5.) * (cos(vec4(2,3,1,0)*i)*.5+.5 - iY * 0.2);
  }

  gl_FragColor.g *= iZ;
  gl_FragColor.r *= iQ;
}