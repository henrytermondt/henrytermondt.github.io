precision highp float;

varying float vAges;

void main() {
    vec3 blue = vec3(0.043, 0.325, 0.580);
    vec3 green = vec3(0.122, 0.741, 0.471);

    gl_FragColor = vec4(mix(blue, green, pow(vAges, 2.0)) * vAges, vAges);
}