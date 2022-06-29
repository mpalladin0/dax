<script lang="ts">
	export let text;
</script>

<div class="neon-text center" style="pointer-events: none">
	<div class="centered" style="pointer-events: auto;">
		<div class="neon">{text}</div>
	</div>

	<svg>
		<defs>
			<filter id="stroke">
				<feMorphology operator="dilate" radius="1" in="SourceGraphic" result="outside" />
				<feMorphology operator="dilate" radius="2" in="outside" result="thickened" />
				<feComposite operator="out" in2="SourceGraphic" in="thickened" result="stroke" />
			</filter>

			<filter id="inner-glow">
				<feFlood flood-color="#e10b8d" />
				<feComposite in2="SourceAlpha" operator="out" />
				<feGaussianBlur stdDeviation="0.5" result="blur" />
				<feComposite operator="atop" in2="SourceGraphic" />
			</filter>

			<filter id="outer-glow">
				<!-- Thicken out the original shape -->
				<feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken" />

				<!-- Use a gaussian blur to create the soft blurriness of the glow -->
				<feGaussianBlur in="thicken" stdDeviation="2.5" result="blurred" />

				<!-- Change the colour -->
				<feFlood flood-color="#db0273" result="glowColor" />

				<!-- Color in the glows -->
				<feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />

				<!--	Layer the effects together -->
				<feMerge>
					<feMergeNode in="softGlow_colored" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>

			<filter id="outer-glow1">
				<!-- Thicken out the original shape -->
				<feMorphology operator="dilate" radius="20" in="SourceAlpha" result="thicken" />

				<!-- Use a gaussian blur to create the soft blurriness of the glow -->
				<feGaussianBlur in="thicken" stdDeviation="25" result="blurred" />

				<!-- Change the colour -->
				<feFlood flood-color="#530139" result="glowColor" />

				<!-- Color in the glows -->
				<feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />

				<!--	Layer the effects together -->
				<feMerge>
					<feMergeNode in="softGlow_colored" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>
	</svg>
</div>

<style>
	:root {
		background: #000106;
		pointer-events: visible;
	}

	.center {
		/* border: 5px solid #ffff00; */
		z-index: 99;
		text-align: center;
		position: absolute;
		right: 0;
		left: 0;
		top: 0;
		bottom: auto;
		margin: auto;
	}

	.neon {
		font-family: 'Neon 80s';
		font-size: 5rem;
		color: #ffedff;
		padding: 30px;
		filter: url(#stroke) url(#inner-glow) url(#outer-glow) url(#outer-glow1);
		background: 'transparent';
	}

	a:visited {
		color: deepskyblue;
	}
</style>
