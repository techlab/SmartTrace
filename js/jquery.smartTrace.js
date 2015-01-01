/* SmartTrace
 * A browser based input trace plugin
 * Version: 0.6 beta
 * by Dipu Raj 
 * http://www.techlaboratory.net 
 * http://www.dipuraj.me 
 */
(function($){
    $.fn.smartTrace = function(action) {
        var options = $.extend({}, $.fn.smartTrace.defaults, action);
        
        return this.each(function(){
            var obj = $(this);
            
            // Method calling logic
            if(!action || action === 'init' || typeof action === 'object') {
              init();
            }else if(action === 'startTrace') {
              init();
            }else if(action === 'stopTrace') {
              init();
            }else if(action === 'getTrace') {
              init();
            }else if(action === 'clearTrace') {
              obj.removeData('trace');
            }else if(action === 'drawTrace') {
              drawTrace(obj);
            }else{
              $.error('Method '+action+' does not exist');
            }
                                                
            function init(){
                // Double Click
                $(obj).dblclick(function(e) {
                   logTrace('DoubleClicked X:'+e.pageX + ' Y:'+e.pageY);
                });
                
                // focus out
                $(obj).focusout(function(e) {
                   logTrace('FocusOut X:'+e.pageX + ' Y:'+e.pageY);
                });
                
                // focus in
                $(obj).focusin(function(e) {
                   logTrace('FocusIn X:'+e.pageX + ' Y:'+e.pageY);
                });
                
                // mouse enter
                $(obj).mouseenter(function(e) {
                   logTrace('MouseEnter X:'+e.pageX + ' Y:'+e.pageY);
                });
                
                // mouse leave
                $(obj).mouseleave(function(e) {
                   logTrace('MouseLeave X:'+e.pageX + ' Y:'+e.pageY);
                });   
                
                // mouse down
                $(obj).mousedown(function(e) {
                   obj.data("mb",e.which);
                   logTrace('MouseDown:'+e.which+' X:'+e.pageX + ' Y:'+e.pageY);
                   
                   addPoint(obj,'mousedown',e);
                   addAction(obj,'mousedown',e);
                }); 
                
                // mouse up
                $(obj).mouseup(function(e) {
                   obj.removeData('mb');
                   logTrace('MouseUp X:'+e.pageX + ' Y:'+e.pageY);

                   addPoint(obj,'mouseup',e);
                   addAction(obj,'mouseup',e);
                });                
                
                // mouse move
                $(obj).mousemove(function(e) {
                   $('#traceLogXY').html('MouseMove X:'+e.pageX + ' Y:'+e.pageY);
                   
                   addPoint(obj,'mousemove',e);
                   addAction(obj,'mousemove',e);
                });          
                
            }
          
        });
        
        function addPoint(o,action,e){
            var c = '';
            var x = e.pageX;
            var y = e.pageY;
            if(action === 'mousemove'){
                var mb = o.data("mb");
                switch (mb) {
                    case 1:
                        c += 'mousePoint mouseDownLeftPoint';
                        break;
                    case 2:
                        c += 'mousePoint mouseDownMiddlePoint';
                        break;
                    case 3:
                        c += 'mousePoint mouseDownRightPoint';
                        break;
                    default:
                        c += 'mousePoint';
                        break;
                }    
            }else if(action === 'mousedown'){
                var mb = o.data("mb");
                switch (mb) {
                    case 1:
                        c += 'mousePoint mouseLeftDown';
                        break;
                    case 2:
                        c += 'mousePoint mouseMiddleDown';
                        break;
                    case 3:
                        c += 'mousePoint mouseRightDown';
                        break;
                    default:
                        c += 'mousePoint mouseLeftDown';
                        break;
                }    
                x = x -10;                
                y = y -10;
            }else if(action === 'mouseup'){
                c += 'mouseUp';
                x = x -10;                
                y = y -10;
            }
            var p = $('<div></div>').addClass(c).offset({ top: y, left: x});
            o.append(p);
            p.fadeIn('fast');
        }
        
        function addAction(obj,action,e){
            var t = obj.data("trace") ? obj.data("trace") : [];
            t.push({ action:action , x:e.pageX, y:e.pageY, mb:e.which, id:null, name:null, time:null});
            obj.data("trace",t);
        }
        
        function drawTrace(obj){
            if(obj.data("trace")){
                $.each(obj.data("trace"), function( i, t ) {
                    var e = {pageX:t.x, pageY:t.y};
                    if(t.action === 'mousedown'){
                       obj.data("mb",t.mb); 
                    }else if(t.action === 'mouseup'){
                       obj.removeData('mb'); 
                    }
                    
                    addPoint(obj,t.action,e);
                });
            }
        }

        function logTrace(txt){
            $('#traceLog').prepend('<div class="traceLine">'+txt+'</div>');
        }
    };

    // Default Properties and Events
    $.fn.smartTrace.defaults = {
        mouseTrace: true,
        keyTrace: true
    };
})(jQuery);