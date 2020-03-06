function $(...args) {
    return document.querySelectorAll(args);
    // return document.getElementById(args);
}

$('input#calc')[0].addEventListener('click', function () {
    // if ()
    console.log(document.getElementById('box_dx').checked);


    // if ($('input#v')[0].value && $('input#dt')[0].value) {
    //     $('input#dx')[0].value = $('input#v')[0].value * $('input#dt')[0].value;
    // }

    // $('input#dt')[0].value = 8;
    // $('input#v')[0].value = $('input#dx')[0].value / $('input#dt')[0].value;
    // $('input#a')[0].value = $('input#dx')[0].value / Math.pow($('input#dt')[0].value, 2);
});

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}