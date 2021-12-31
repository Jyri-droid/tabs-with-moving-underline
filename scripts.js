function getAllTabs(tab) {
    let tabContainer = tab.parentNode;
    return tabContainer.getElementsByClassName("tab");
}

function getUnderline(tab) {
    let tabSystem = tab.parentNode.parentNode;
    let underline = tabSystem.getElementsByClassName("tabUnderline");
    return underline[0];
}

function countWidthOfPreviousTabs(tab) {
    let widthOfPreviousTabs = 0;
    for (let i of getAllTabs(tab)) {
        if (i == tab) { return widthOfPreviousTabs }
        widthOfPreviousTabs += i.offsetWidth;
    }
}

function positionUnderline(tab) {
    getUnderline(tab).style.width = tab.offsetWidth + "px";
    getUnderline(tab).style.marginLeft = countWidthOfPreviousTabs(tab) + "px";
}

function selectTab(tab) {
    for (let i of getAllTabs(tab)) {
        i.className = i.className.replace(" active", "");
    }
    tab.className += " active";
    positionUnderline(tab);
}

function returnUnderlineUnderActiveTab(tabContainer) {
    let activeTab = tabContainer.getElementsByClassName("tab active");
    positionUnderline(activeTab[0]);
}

function extendUnderline(tab) {
    let allTabs = getAllTabs(tab);
    for (let i = 0; i < allTabs.length; i++) {
        if (tab == allTabs[i]) {
            var hoveredTabNumber = i.valueOf();
        }
        if (allTabs[i].className == "tab active") {
            var activeTabNumber = i.valueOf();
        }
    }
    let widthOfUnderline = 0;
    if (hoveredTabNumber < activeTabNumber) {
        for (let i = hoveredTabNumber; i <= activeTabNumber; i++) {
            widthOfUnderline += allTabs[i].offsetWidth;
        }
        getUnderline(tab).style.marginLeft = countWidthOfPreviousTabs(tab) + "px";
    } else {
        for (let i = activeTabNumber; i <= hoveredTabNumber; i++) {
            widthOfUnderline += allTabs[i].offsetWidth;
        }
    }
    getUnderline(tab).style.width = widthOfUnderline + "px";
}

let allActiveTabs = document.getElementsByClassName("tab active");
for (let k of allActiveTabs) {
    positionUnderline(k);
}

// Mobile version

// Make container draggable
const slider = document.querySelector(".tabSystem4");
let isDown = false;
let startX;
let scrollLeft;
let scrollCorrectedX;

function correctXForTabWidth(sliderX) {
    scrollCorrectedX = steps[findTabNumberToSnap(sliderX)] - (firstMobileTab.offsetWidth / 2) + (allMobileTabs[findTabNumberToSnap(sliderX)].offsetWidth / 2);
    return scrollCorrectedX;
}

/*
slider.addEventListener("mousedown", function(thisEvent) {
    isDown = true;
    startX = thisEvent.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});
slider.addEventListener("mouseleave", function(thisEvent) {
    isDown = false;
    animateSnap(correctXForTabWidth(slider.scrollLeft));
});
slider.addEventListener("mouseup", function() {
    isDown = false;
    animateSnap(correctXForTabWidth(slider.scrollLeft));
});
slider.addEventListener("mousemove", function(thisEvent) {
    // Move slider
    if(isDown == false) return;
    thisEvent.preventDefault();
    const x = thisEvent.pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; // Scroll 3x faster
    slider.scrollLeft = scrollLeft - walk;
    // Highlight tab upon scroll
    selectMobileTab(allMobileTabs[findTabNumberToSnap(slider.scrollLeft)]);
}); */

slider.addEventListener("touchstart", function(thisEvent) {
    isDown = true;
    startX = thisEvent.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});
/* slider.addEventListener("touchcancel", function(thisEvent) {
    isDown = false;
    animateSnap(correctXForTabWidth(slider.scrollLeft));
}); */
slider.addEventListener("touchend", function() {
    isDown = false;
    animateSnap(correctXForTabWidth(slider.scrollLeft));
});
slider.addEventListener("touchmove", function(thisEvent) {
    // Move slider
    if(isDown == false) return;
    thisEvent.preventDefault();
    const x = thisEvent.pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; // Scroll 3x faster
    slider.scrollLeft = scrollLeft - walk;
    // Highlight tab upon scroll
    selectMobileTab(allMobileTabs[findTabNumberToSnap(slider.scrollLeft)]);
});

//Align first and last tab in the center of the container
let mobileTabSystem = document.getElementsByClassName("tabSystem4");
let allMobileTabs = mobileTabSystem[0].getElementsByClassName("tab");
let firstMobileTab = allMobileTabs[0];
let lastMobileTab = allMobileTabs[allMobileTabs.length - 1];
let centerOfView = mobileTabSystem[0].offsetWidth / 2;
firstMobileTab.style.marginLeft = centerOfView - (firstMobileTab.offsetWidth / 2) + "px";
lastMobileTab.style.marginRight = centerOfView - (lastMobileTab.offsetWidth / 2) + "px";

// Create an array with steps based on tabs' widths
let steps = [0];
let stepCounter = 0;
for (let i = 0; i < allMobileTabs.length; i++) {
    stepCounter += allMobileTabs[i].offsetWidth;
    steps.push(stepCounter);
}

// Assign mobile selector's width based on active tab's width
function setMobileUnderlineWidth() {
    let mobileSelection = document.getElementsByClassName("mobileUnderline");
    let activeTab = mobileTabSystem[0].getElementsByClassName("tab mobileActive");
    mobileSelection[0].style.width = activeTab[0].offsetWidth + "px";
}
setMobileUnderlineWidth()

// Snap scroll to center of tab
let tabNumberToSnap;
function findTabNumberToSnap(offset) {
    let centerX = offset + (firstMobileTab.offsetWidth / 2);
    for (let i = 0; i < steps.length; i++) {
        if (centerX >= steps[i]  && centerX < steps[i + 1]) {
            tabNumberToSnap = i;
        }
    }
    return tabNumberToSnap;
}

// Highlight selected tab
function selectMobileTab(tab) {
    for (let i of getAllTabs(tab)) {
        i.className = i.className.replace(" mobileActive", "");
    }
    tab.className += " mobileActive";
    setMobileUnderlineWidth()
}
// Animation for snap with a transition
let id = null;
function animateSnap(pointToSnap) {
    pointToSnap = Math.round(pointToSnap);
    clearInterval(id);
    id = setInterval(frame, 10);
    let position = mobileTabSystem[0].scrollLeft;
    function frame() {
        if (position == pointToSnap) {
            clearInterval(id);
        } else {
        if (pointToSnap > mobileTabSystem[0].scrollLeft) { 
            position++; 
        } else { 
            position--; 
        };
        mobileTabSystem[0].scrollLeft = position;
    }
  }
}