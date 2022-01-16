function loadJsonFile(path)
{
	return $.getJSON("https://raw.githubusercontent.com/andrewpratt128/Powerpoint/main/" + path, function (data)
	{
		return data;
	})
}


async function loadSlidesFromJson()
{
	let slides = {};
	let slideOrder = null;

	await loadJsonFile("slides.json").then(async function (data)
	{
		for (let file of data.files)
		{
			console.log("FILE: " + file);
			await loadJsonFile(file).then(function (data)
			{
				console.log("SLIDE ID: " + data.id);
				slides[ data.id ] = data;
			});
		}

		
		slideOrder = data.order;
	});

	return {
		slides: slides,
		slideOrder: slideOrder,
		currentId: null
	};
}


function nextSlide(ctx)
{
	console.log(JSON.stringify(ctx));
	deploySlide(ctx.slides[ ctx.slideOrder[ parseInt(++ctx.currentId)] ]);
}


async function deployBodyTo(bodyObj, layout, parent)
{
	if (layout == "list")
	{
		let ul = document.createElement("ul");
		for (let bullet of bodyObj)
		{
			let li = document.createElement("li");
			li.innerHTML = bullet;
			ul.append(li);
		}
		parent.append(ul);
	}
	else if (layout == "dual")
	{
		deploySlide(bodyObj.first.body, bodyObj.first.bodyLayout, $(".SlideBodyFirstChildPane"));
	}
	else if (layout == "img")
	{
		let img = document.createElement("img");
		img.src = bodyObj.src;
		img.addClass("BodyImg");
		parent.append(img);
	}
}


async function deploySlide(slide)
{
	$(".SlideContent").remove();
	
	if (slide.layout == "HeaderContent")
	{
		$(".Slide").append($("#tempSlideHeaderContentLayout").html());
		$(".SlideTitle").text(slide.title);
		$(".SlideSubtitle").text(slide.subtitle);
	}
	else if (slide.layout == "HeaderDualContent")
	{
		$(".Slide").append($("#tempSlideHeaderDualContentLayout").html());
		$(".SlideTitle").text(slide.title);
		$(".SlideSubtitle").text(slide.subtitle);
	}

	deployBodyTo(slide.body, slide.bodyLayout, $(".SlideBodyPane"));

	
}



$(document).ready(async function ()
{
	let ctx = await loadSlidesFromJson();
	await deploySlide(ctx.slides[ ctx.slideOrder[ 0 ] ]);
	ctx.currentId = 0;
	
	$(".NextBtn").click(function () { nextSlide(ctx); });
});