define(["dust"], function (dust){(function(){dust.register("path",body_0);function body_0(chk,ctx){return chk.section(ctx.get("documents"),ctx,{"block":body_1},null);}function body_1(chk,ctx){return chk.write("<div class=\"row\"><span class=\"iconic remove\">x</span>").reference(ctx.get("fileName"),ctx,"h").write("<span class=\"counter\">").reference(ctx.get("length"),ctx,"h").write("</span>").exists(ctx.get("previous"),ctx,{"block":body_2},null).write("</div>");}function body_2(chk,ctx){return chk.exists(ctx.get("op"),ctx,{"block":body_3},null);}function body_3(chk,ctx){return chk.write("<span class=\"icon ").reference(ctx.get("op"),ctx,"h").write("\"></span></div><div class=\"options\">").section(ctx.get("ops"),ctx,{"block":body_4},null);}function body_4(chk,ctx){return chk.write("<div class=\"").reference(ctx.get("type"),ctx,"h").write(" icon\">").reference(ctx.get("id"),ctx,"h").write("</div>");}return body_0;})();(function(){dust.register("row-stream",body_0);function body_0(chk,ctx){return chk.write("<span>").section(ctx.get("data"),ctx,{"block":body_1},null).write("</span>");}function body_1(chk,ctx){return chk.section(ctx.get("stream"),ctx,{"block":body_2},null);}function body_2(chk,ctx){return chk.exists(ctx.get("clazz"),ctx,{"block":body_3},null).reference(ctx.get("line"),ctx,"h",["s"]).write("\n");}function body_3(chk,ctx){return chk.write("</span><span class='").reference(ctx.get("clazz"),ctx,"h").write("'>");}return body_0;})(); return dust; });