
// main banner - 2초마다 3개의 이미지 변경
function changeBanner() {
    change($('#bannerIndex').val());
    var num = $('#bannerIndex').val();
    num++;
    document.getElementById('bannerIndex').setAttribute('value', num);
    first_change();
}

function change(val) {
    $('.img_box').eq(val).siblings().filter('.img_box').hide();
    $('a', '.a_box').eq(val).siblings().filter('a').hide();
    $('.img_box').eq(val).show();
    $('a', '.a_box').eq(val).show();
    $('li', '.label').eq(val).css('border', ' 2px solid #4285f4');
    $('li', '.label').eq(val).siblings().filter('li').css('border', '');
}

function first_change() {
    setInterval(function() {
    if(document.getElementById('find').value==1){}
    else{
        change($('#bannerIndex').val());
        var num = $('#bannerIndex').val()
        if (num == 2)
            document.getElementById('bannerIndex').setAttribute('value', 0);
        else {
            num++;
            document.getElementById('bannerIndex').setAttribute('value', num);
        }
    }
    }, 2000);
}

$('li','.label').mouseover(function(){
    document.getElementById('find').setAttribute('value',1);
    }).mouseout(function(){
    document.getElementById('find').setAttribute('value',0);
});

// mobile side menu
function toggleMenu(e) {
  var navbar = $('#mobile-headers #sidebar')

  navbar.toggleClass('side-open')

  if (navbar.hasClass('side-open')) {
    $('body').css('overflow-y', 'hidden');
  } else {
    $('body').css('overflow-y', 'auto');
  }
}