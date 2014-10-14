(function() {
    CodeMirror.keyMap.custom = {
        fallthrough: "default",
        "Cmd-S": "updateCode"
    };

    CodeMirror.commands["updateCode"] = function(cm) {
        cm.save();

        console.log("updating code...");
        try {
            eval(textarea.value);
            window.renderFrame = renderFrame;
        } catch(ex) { console.error(ex); }
    };

    var textarea = document.querySelector('textarea'), editor;

    textarea.value = renderFrame.toString();

    editor = CodeMirror.fromTextArea(textarea, {
        theme: 'pastel-on-dark',
        lineNumbers: true,
        keyMap: 'custom',
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false
    });
} ());

