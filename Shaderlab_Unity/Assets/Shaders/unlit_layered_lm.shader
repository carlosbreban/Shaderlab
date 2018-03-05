Shader "CBTOOLS/Unlit Layered Lightmapped" {
	Properties {
		_Control ("Control (RGBA)", 2D) = "red" {}
		_Splat3 ("Layer 3 (A)", 2D) = "white" {}
		_Splat2 ("Layer 2 (B)", 2D) = "white" {}
		_Splat1 ("Layer 1 (G)", 2D) = "white" {}
		_Splat0 ("Layer 0 (R)", 2D) = "white" {}
		_Base ("Base", 2D) = "white" {}
		_LightMap ("Lightmap (RGB)", 2D) = "black" {}	
		_LMMulti ("Light Map Intensity (A)", Color) = (1,1,1,1)
		}
		
	SubShader {
		Pass {
			CGPROGRAM
			#pragma vertex vert_img
			#pragma fragment frag
			#include "UnityCG.cginc"
			
			uniform sampler2D _Control;	
			uniform sampler2D _Splat3;	
			uniform sampler2D _Splat2;
			uniform sampler2D _Splat1;			
			uniform sampler2D _Splat0;
			uniform sampler2D _Base;
			uniform sampler2D _LightMap;

			uniform float4 _Splat3_ST; 
			uniform float4 _Splat2_ST; 			
			uniform float4 _Splat1_ST;
			uniform float4 _Splat0_ST; 
 			uniform float4 _Base_ST;
			uniform float4 _LightMap_ST;
			uniform float4 _LMMulti;

			float4 frag(v2f_img input) : COLOR {
				float4 splat_control = tex2D(_Control, input.uv);
				float4 myTexture = tex2D(_Base, _Base_ST.xy * input.uv.xy + _Base_ST.zw);
				float4 myTexture0 = tex2D(_Splat0, _Splat0_ST.xy * input.uv.xy + _Splat0_ST.zw);
				float4 myTexture1 = tex2D(_Splat1, _Splat1_ST.xy * input.uv.xy + _Splat1_ST.zw);
				float4 myTexture2 = tex2D(_Splat2, _Splat2_ST.xy * input.uv.xy + _Splat2_ST.zw);
				float4 myTexture3 = tex2D(_Splat3, _Splat3_ST.xy * input.uv.xy + _Splat3_ST.zw);
				float4 myTexture4 = tex2D(_LightMap, _LightMap_ST.xy * input.uv.xy + _LightMap_ST.zw);

				float4 blendBase = myTexture * saturate(1 - (splat_control.a + splat_control.b + splat_control.g + splat_control.r));
				float4 blend0 = (myTexture0 * splat_control.r) * (1 - splat_control.a);
				float4 blend1 = (myTexture1 * splat_control.g) * (1 - splat_control.a);
				float4 blend2 = (myTexture2 * splat_control.b) * (1 - splat_control.a);
				float4 blend3 = myTexture3 * splat_control.a;
				float4 blend4 = saturate( myTexture4  + (1 - _LMMulti.a));
				
				float4 myFinalTexture = (blendBase + blend0 + blend1 + blend2 + blend3) * blend4 ;
				return myFinalTexture;
			}
			
			ENDCG
		}
	}
}		