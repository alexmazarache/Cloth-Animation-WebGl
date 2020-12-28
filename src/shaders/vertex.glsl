#version 300 es

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

varying vec3 v_view;
varying vec3 v_light;
varying vec3 v_normal;
varying vec2 v_texcoord;

void main() {
	vec4 p = u_modelView * vec4(a_position, 1.0);
	v_normal = mat3(u_modelView) * a_normal;
	v_view = -p.xyz;
	v_light = u_lightPos - p.xyz;
	v_texcoord = a_texcoord;
	gl_Position = u_proj * p;
}