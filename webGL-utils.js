
(function(root) {

    /**
     * log util
     */
    function warn (str) {
        !!console.warn ? console.warn(str) : console.log(str)
    }

    /**
     * glExists
     *
     * @author {MrDoob} mrdoob.com
     * @protected
     */
    function glExists () {
        return (function () { 
            try {
                var canvas = document.createElement( 'canvas' )
                return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
            } catch (e) {
                return null
            }
        })()
    }

    /**
     * compileShader
     *
     * @param {gl-context}
     * @param {String} type - can be 'vertex' or 'fragment'
     * @param {String} source
     * @return {GL_SHADER}
     * @protected
     */
    function compileShader(gl, type, source) {
        var shader = gl.createShader(type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            warn("could not compile " + type + " shader:\n\n" + gl.getShaderInfoLog(shader))
            return null
        } else {
            return shader
        }
    }

    /**
     * getGLprog
     * 
     * @param {Object} canvas - dom handle
     * @param {String} fragmentShader - shader source
     * @param {String} vertexShader - shader source
     * @return {gl-context} - returns context with program attached to it (gl.program)
     */
    function getGLprog(canvas, fs, vs) {

        if (!glExists()) warn('Can\'t get GL context!')
        else if (!canvas) warn('canvas was not defined')
        else if (typeof fs !== 'string') warn('fragmentShader was not defined or isn\'t a string')
        else if (typeof vs !== 'string') warn('vertexShader was not defined or isn\'t a string')
        else {

            // get gl context
            var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

            var compiled_vs = compileShader(gl, 'vertex', vs)
            var compiled_fs = compileShader(gl, 'fragment', fs)

            if(!compiled_fs || !compiled_vs) return null

            gl.program = gl.createProgram()
            gl.attachShader(gl.program, compiled_vs)
            gl.attachShader(gl.program, compiled_fs)
            gl.linkProgram(gl.program)

            if (!gl.getProgramParameter(gl.program, gl.LINK_STATUS)) {
                warn('could not link the shader program!')
                gl.deleteProgram(gl.program)
                gl.deleteProgram(compiled_vs)
                gl.deleteProgram(compiled_fs)
                return null
            } else {
                // install program to current rendering state
                gl.useProgram(gl.program)
                return gl
            }
        }

        return null
    }

    root.getGLprog = getGLprog

})(typeof module !== 'undefined' && module.exports ? module.exports : this)