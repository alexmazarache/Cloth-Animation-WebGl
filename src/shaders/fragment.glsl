#version 300 es

varying vec3 v_view;
varying vec3 v_light;
varying vec3 v_normal;
varying vec2 v_texcoord;
uniform sampler2D u_albedo;
void main() {
	vec3 n = normalize(v_normal);
	vec3 l = normalize(v_light);
	vec3 v = normalize(v_view);
	vec3 r = reflect(-l, n);
	vec3 albedo = pow(texture2D(u_albedo, v_texcoord).xyz, vec3(2.2));
	vec3 diffuse = max(dot(n, l), 0.0)*albedo;
	vec3 specular = vec3(0.0);//pow(max(dot(r, v), 0.0), 30.0) * u_lightColor;
	vec3 color = saturate(u_ambient * albedo + diffuse + specular);
	gl_FragColor = vec4(pow(color, vec3(1.0/2.2)), 1.0);
}