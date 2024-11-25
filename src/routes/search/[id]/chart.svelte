<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let data;

	// 데이터가 변경될 때마다 차트를 그립니다.
	$: if (data) {
		drawChart();
	}

	function drawChart() {
		// 기존의 차트를 제거합니다.
		d3.select('#radarChart').selectAll('svg').remove();

		const width = 600;
		const height = 600;
		const radius = Math.min(width, height) / 2 - 50;
		const levels = 5;
		const angleSlice = (Math.PI * 2) / data.length;

		const svg = d3
			.select('#radarChart')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height / 2})`);

		// Draw the background circles first
		for (let i = 0; i < levels; i++) {
			svg
				.append('circle')
				.attr('r', (radius / levels) * (i + 1))
				.style('fill', 'none')
				.style('stroke', 'gray')
				.style('stroke-dasharray', '2,2');
		}

		// Draw the axes and labels first
		data.forEach((d, i) => {
			const line = svg
				.append('line')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', radius * Math.cos(angleSlice * i - Math.PI / 2))
				.attr('y2', radius * Math.sin(angleSlice * i - Math.PI / 2))
				.style('stroke', 'gray')
				.style('stroke-width', '2px');

			svg
				.append('text')
				.attr('x', (radius + 30) * Math.cos(angleSlice * i - Math.PI / 2))
				.attr('y', (radius + 30) * Math.sin(angleSlice * i - Math.PI / 2))
				.attr('dy', '0.35em')
				.style('font-size', '12px')
				.style('text-anchor', 'middle')
				.text(`${d.axis}: ${d.originalValue} / Max: ${d.maxValue}`);
		});

		// Draw the radar chart after the axes
		const radarLine = d3
			.lineRadial()
			.radius((d) => radius * (d.value / 100))
			.angle((d, i) => i * angleSlice)
			.curve(d3.curveLinearClosed);

		const radarPath = svg.append('path').datum(data).attr('d', radarLine).style('fill', 'rgba(255, 99, 132, 0.6)').style('stroke', 'rgb(255, 99, 132)').style('stroke-width', '2px');

		// Add points to the radar chart
		svg
			.selectAll('.data-point')
			.data(data)
			.enter()
			.append('circle')
			.attr('class', 'data-point')
			.attr('r', 4) // Point radius
			.attr('cx', (d, i) => radius * (d.value / 100) * Math.cos(angleSlice * i - Math.PI / 2))
			.attr('cy', (d, i) => radius * (d.value / 100) * Math.sin(angleSlice * i - Math.PI / 2))
			.style('fill', 'rgb(255, 99, 132)')
			.style('stroke', '#fff')
			.style('stroke-width', '1.5px');
	}

	onMount(() => {
		// 초기 데이터 로드 및 차트 그리기
		drawChart();
	});
</script>

<div class="chartContainer">
	<div id="radarChart"></div>
</div>

<style>
	.chartContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
	.tooltip {
		pointer-events: none;
	}
</style>
