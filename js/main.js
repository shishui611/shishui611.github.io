/*
作者: imsyy
主页：https://www.imsyy.top/
GitHub：https://github.com/imsyy/home
版权所有，请勿删除
*/

//弹窗样式
iziToast.settings({
	timeout: 10000,
	progressBar: false,
	close: false,
	closeOnEscape: true,
	position: "topCenter",
	transitionIn: "bounceInDown",
	transitionOut: "flipOutX",
	displayMode: "replace",
	layout: "1",
	backgroundColor: "#00000040",
	titleColor: "#efefef",
	messageColor: "#efefef",
	icon: "Fontawesome",
	iconColor: "#efefef",
});

/* 鼠标样式 */
const body = document.querySelector("body");
const element = document.getElementById("g-pointer-1");
const element2 = document.getElementById("g-pointer-2");
const halfAlementWidth = element.offsetWidth / 2;
const halfAlementWidth2 = element2.offsetWidth / 2;

function setPosition(x, y) {
	element2.style.transform = `translate(${x - halfAlementWidth2 + 1}px, ${
    y - halfAlementWidth2 + 1
  }px)`;
}

body.addEventListener("mousemove", (e) => {
	window.requestAnimationFrame(function() {
		setPosition(e.clientX, e.clientY);
	});
});

//加载完成后执行
window.addEventListener(
	"load",
	function() {
		//载入动画
		$("#loading-box").attr("class", "loaded");
		$("#bg").css(
			"cssText",
			"transform: scale(1);filter: blur(0px);transition: ease 1.5s;"
		);
		$(".cover").css("cssText", "opacity: 1;transition: ease 1.5s;");
		$("#section").css(
			"cssText",
			"transform: scale(1) !important;opacity: 1 !important;filter: blur(0px) !important"
		);

		//用户欢迎
		setTimeout(function() {
			iziToast.show({
				timeout: 2500,
				icon: false,
				title: hello,
				message: "欢迎来到我的主页",
			});
		}, 800);

		//延迟加载音乐播放器
		let element = document.createElement("script");
		element.src = "./js/music.js";
		document.body.appendChild(element);

		//中文字体缓加载-此处写入字体源文件 （暂时弃用）
		//先行加载简体中文子集，后续补全字集
		//由于压缩过后的中文字体仍旧过大，可转移至对象存储或 CDN 加载
		// const font = new FontFace(
		//     "MiSans",
		//     "url(" + "./font/MiSans-Regular.woff2" + ")"
		// );
		// document.fonts.add(font);

		//移动端去除鼠标样式
		if (Boolean(window.navigator.userAgent.match(/AppWebKit.*Mobile.*/))) {
			$("#g-pointer-2").css("display", "none");
		}
	},
	false
);

setTimeout(function() {
	$("#loading-text").html("字体及文件加载可能需要一定时间");
}, 3000);

// 新春灯笼（ 需要时可取消注释）
// new_element = document.createElement("link");
// new_element.setAttribute("rel", "stylesheet");
// new_element.setAttribute("type", "text/css");
// new_element.setAttribute("href", "./css/lantern.css");
// document.body.appendChild(new_element);

// new_element = document.createElement("script");
// new_element.setAttribute("type", "text/javascript");
// new_element.setAttribute("src", "./js/lantern.js");
// document.body.appendChild(new_element);

//获取一言
fetch("https://v1.hitokoto.cn?max_length=24")
	.then((response) => response.json())
	.then((data) => {
		$("#hitokoto_text").html(data.hitokoto);
		$("#from_text").html(data.from);
	})
	.catch(console.error);

let times = 0;
$("#hitokoto").click(function() {
	if (times == 0) {
		times = 1;
		let index = setInterval(function() {
			times--;
			if (times == 0) {
				clearInterval(index);
			}
		}, 1000);
		fetch("https://v1.hitokoto.cn?max_length=24")
			.then((response) => response.json())
			.then((data) => {
				$("#hitokoto_text").html(data.hitokoto);
				$("#from_text").html(data.from);
			})
			.catch(console.error);
	} else {
		iziToast.show({
			timeout: 1000,
			icon: "fa-solid fa-circle-exclamation",
			message: "点击太快了哦",
		});
	}
});

const APIKEY = "4b4ab3173e8f47c9bbd42ed7bf840a4c"; // 和风天气key
const getWeather = () => {
	// 这里用固定城市编码（杭州101210101），也可以改成动态定位
	const location = "101210101";

	fetch(`https://geoapi.qweather.com/v2/city/lookup?location=${location}&key=${APIKEY}`)
		.then(response => response.json())
		.then(cityRes => {
			if (cityRes.code === "200" && cityRes.location && cityRes.location.length > 0) {
				const cityName = cityRes.location[0].name;
				$("#city_text").html(cityName);

				// 请求3天天气预报（也可以用其它接口）
				return fetch(`https://devapi.qweather.com/v7/weather/3d?location=${location}&key=${APIKEY}`);
			} else {
				throw new Error("城市信息获取失败");
			}
		})
		.then(response => response.json())
		.then(weatherRes => {
			if (weatherRes.code === "200" && weatherRes.daily && weatherRes.daily.length > 0) {
				const today = weatherRes.daily[0];
				$("#wea_text").html(today.textDay);
				$("#tem_text").html(today.tempMax + "°C ~ " + today.tempMin + "°C&nbsp;");
				$("#win_text").html(today.windDirDay + "风");
				$("#win_speed").html(today.windScaleDay + "级");
			} else {
				console.error("天气信息获取失败");
				iziToast.show({
					timeout: 2000,
					icon: "fa-solid fa-cloud-sun",
					message: "天气信息获取失败",
				});
			}
		})
		.catch(err => {
			console.error("天气信息获取失败：" + err);
			iziToast.show({
				timeout: 2000,
				icon: "fa-solid fa-cloud-sun",
				message: "天气信息获取失败",
			});
		});
};

getWeather();

let wea = 0;
$("#upWeather").click(function() {
	if (wea == 0) {
		wea = 1;
		let index = setInterval(function() {
			wea--;
			if (wea == 0) {
				clearInterval(index);
			}
		}, 60000);
		getWeather();
		iziToast.show({
			timeout: 2000,
			icon: "fa-solid fa-cloud-sun",
			message: "实时天气已更新",
		});
	} else {
		iziToast.show({
			timeout: 1000,
			icon: "fa-solid fa-circle-exclamation",
			message: "请稍后再更新哦",
		});
	}
});

//获取时间
let t = null;
t = setTimeout(time, 1000);

function time() {
	clearTimeout(t);
	dt = new Date();
	let y = dt.getYear() + 1900;
	let mm = dt.getMonth() + 1;
	let d = dt.getDate();
	let weekday = [
		"星期日",
		"星期一",
		"星期二",
		"星期三",
		"星期四",
		"星期五",
		"星期六",
	];
	let day = dt.getDay();
	let h = dt.getHours();
	let m = dt.getMinutes();
	let s = dt.getSeconds();
	if (h < 10) {
		h = "0" + h;
	}
	if (m < 10) {
		m = "0" + m;
	}
	if (s < 10) {
		s = "0" + s;
	}
	$("#time").html(
		y +
		"&nbsp;年&nbsp;" +
		mm +
		"&nbsp;月&nbsp;" +
		d +
		"&nbsp;日&nbsp;" +
		"<span class='weekday'>" +
		weekday[day] +
		"</span><br>" +
		"<span class='time-text'>" +
		h +
		":" +
		m +
		":" +
		s +
		"</span>"
	);
	t = setTimeout(time, 1000);
}

//链接提示文字
$("#social")
	.mouseover(function() {
		$("#social").css({
			background: "rgb(0 0 0 / 25%)",
			"border-radius": "6px",
			"backdrop-filter": "blur(5px)",
		});
		$("#link-text").css({
			display: "block",
		});
	})
	.mouseout(function() {
		$("#social").css({
			background: "none",
			"border-radius": "6px",
			"backdrop-filter": "none",
		});
		$("#link-text").css({
			display: "none",
		});
	});

$("#github")
	.mouseover(function() {
		$("#link-text").html("去 Github 看看");
	})
	.mouseout(function() {
		$("#link-text").html("通过这里联系我");
	});
$("#qq")
	.mouseover(function() {
		$("#link-text").html("有什么事吗");
	})
	.mouseout(function() {
		$("#link-text").html("通过这里联系我");
	});
$("#email")
	.mouseover(function() {
		$("#link-text").html("来封 Email");
	})
	.mouseout(function() {
		$("#link-text").html("通过这里联系我");
	});
$("#bilibili")
	.mouseover(function() {
		$("#link-text").html("来 B 站看看 ~");
	})
	.mouseout(function() {
		$("#link-text").html("通过这里联系我");
	});
$("#telegram")
	.mouseover(function() {
		$("#link-text").html("你懂的 ~");
	})
	.mouseout(function() {
		$("#link-text").html("通过这里联系我");
	});

//自动变灰
let myDate = new Date();
let mon = myDate.getMonth() + 1;
let date = myDate.getDate();
let days = ["4.4", "5.12", "7.7", "9.9", "9.18", "12.13"];
for (let day of days) {
	let d = day.split(".");
	if (mon == d[0] && date == d[1]) {
		document.write(
			"<style>html{-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);_filter:none}</style>"
		);
		$("#change").html("Silence&nbsp;in&nbsp;silence");
		$("#change1").html("今天是中国国家纪念日，全站已切换为黑白模式");
		window.addEventListener(
			"load",
			function() {
				setTimeout(function() {
					iziToast.show({
						timeout: 14000,
						icon: "fa-solid fa-clock",
						message: "今天是中国国家纪念日",
					});
				}, 3800);
			},
			false
		);
	}
}

//更多页面切换
let shoemore = false;
$("#switchmore").on("click", function() {
	shoemore = !shoemore;
	if (shoemore && $(document).width() >= 990) {
		$("#container").attr("class", "container mores");
		$("#change").html("Oops&nbsp;!");
		$("#change1").html("哎呀，这都被你发现了（ 再点击一次可关闭 ）");
	} else {
		$("#container").attr("class", "container");
		$("#change").html("Hello&nbsp;World&nbsp;!");
		$("#change1").html("一个不正经的Up");
	}
});

//更多页面关闭按钮
$("#close").on("click", function() {
	$("#switchmore").click();
});

//移动端菜单栏切换
let switchmenu = false;
$("#switchmenu").on("click", function() {
	switchmenu = !switchmenu;
	if (switchmenu) {
		$("#row").attr("class", "row menus");
		$("#menu").html("<i class='fa-solid fa-xmark'></i>");
	} else {
		$("#row").attr("class", "row");
		$("#menu").html("<i class='fa-solid fa-bars'></i>");
	}
});

//更多弹窗页面
$("#openmore").on("click", function() {
	$("#box").css("display", "block");
	$("#row").css("display", "none");
	$("#more").css("cssText", "display:none !important");
});
$("#closemore").on("click", function() {
	$("#box").css("display", "none");
	$("#row").css("display", "flex");
	$("#more").css("display", "flex");
});

//监听网页宽度
window.addEventListener("load", function() {
	window.addEventListener("resize", function() {
		//关闭移动端样式
		if (window.innerWidth >= 600) {
			$("#row").attr("class", "row");
			$("#menu").html("<i class='fa-solid fa-bars'></i>");
			//移除移动端切换功能区
			$("#rightone").attr("class", "row rightone");
		}

		if (window.innerWidth <= 990) {
			//移动端隐藏更多页面
			$("#container").attr("class", "container");
			$("#change").html("Hello&nbsp;World&nbsp;!");
			$("#change1").html("一个不正经的Up");

			//移动端隐藏弹窗页面
			$("#box").css("display", "none");
			$("#row").css("display", "flex");
			$("#more").css("display", "flex");
		}
	});
});

//移动端切换功能区
let changemore = false;
$("#changemore").on("click", function() {
	changemore = !changemore;
	if (changemore) {
		$("#rightone").attr("class", "row menus mobile");
	} else {
		$("#rightone").attr("class", "row menus");
	}
});

//更多页面显示关闭按钮
$("#more").hover(
	function() {
		$("#close").css("display", "block");
	},
	function() {
		$("#close").css("display", "none");
	}
);

// 初始化默认背景，设置为每日风景
function initDefaultBg() {
	let bg_img = getBgImg();

	// 如果已有背景类型不是3，则修改为3
	if (!bg_img || bg_img.type !== "4") {
		bg_img = {
			type: "4",
			1: bg_img_preinstall[1] || "./img/background1.webp",
			2: bg_img_preinstall[2],
			3: bg_img_preinstall[3],
			4: bg_img_preinstall[4],
		};
		setBgImg(bg_img);
	}

	// 应用背景图片（这里假设你有设置背景图片的函数，或直接写）
	$("body").css("background-image", `url("${bg_img_preinstall[bg_img.type]}")`);
	$("#bg").attr("src", bg_img_preinstall[bg_img.type]);
}

// 页面加载完后调用初始化背景
window.addEventListener("load", () => {
	initDefaultBg();
});

//屏蔽右键
document.oncontextmenu = function() {
	iziToast.show({
		timeout: 2000,
		icon: "fa-solid fa-circle-exclamation",
		message: "为了浏览体验，本站禁用右键",
	});
	return false;
};

//控制台输出
//console.clear();
let styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
`;
let styleTitle2 = `
font-size:12px;
color: rgb(244,167,89);
`;
let styleContent = `
color: rgb(30,152,255);
`;
let title1 = "ShiShuiの主页";
let title2 = `
   _____ _     _       _       
  / ____| |   (_)     | |      
 | (___ | |__  _ _ __ | | ___  
  \___ \| '_ \| | '_ \| |/ _ \ 
  ____) | | | | | | | | | (_) |
 |_____/|_| |_|_|_| |_|_|\___/ 
                               
                                                 
`;
let content = `
版 本 号：1.0
更新日期：2025.6.26

`;
console.log(
	`%c${title1} %c${title2}
%c${content}`,
	styleTitle1,
	styleTitle2,
	styleContent
);