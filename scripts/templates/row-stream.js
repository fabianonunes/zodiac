(function(){dust.register("row-stream",body_0);function body_0(chk,ctx){return chk.write("<span>").section(ctx.get("data"),ctx,{"block":body_1},null).write("</span>");}function body_1(chk,ctx){return chk.section(ctx.get("stream"),ctx,{"block":body_2},null);}function body_2(chk,ctx){return chk.exists(ctx.get("clazz"),ctx,{"block":body_3},null).reference(ctx.get("line"),ctx,"h",["s"]).write("\n");}function body_3(chk,ctx){return chk.write("</span><span class=\"").reference(ctx.get("clazz"),ctx,"h").write("\">");}return body_0;})();