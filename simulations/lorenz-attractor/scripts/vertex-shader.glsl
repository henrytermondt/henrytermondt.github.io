attribute vec3 aPos;
attribute float aAges;

varying float vAges;

uniform mat4 projection;
uniform mat4 view;

void main() {
    vAges = aAges;
    gl_Position = projection * view * vec4(aPos, 1);
}