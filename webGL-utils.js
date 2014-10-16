
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
                return false
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
            return warn("could not compile " + type + " shader:\n\n" + gl.getShaderInfoLog(shader))
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
    function getGLprog(canvas, fragmentShader, vertexShader) {

        if (!glExists()) return warn('Can\'t get GL context!')
        if (!fragmentShader) return warn('fragmentShader was not defined')
        if (!vertexShader) return warn('vertexShader was not defined')

        // get gl context
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

        gl.program = gl.createProgram()
        gl.attachShader(gl.program, compileShader(gl, 'vertex', vertexShader))
        gl.attachShader(gl.program, compileShader(gl, 'fragment', fragmentShader))
        gl.linkProgram(gl.program)

        if (!gl.getProgramParameter(gl.program, gl.LINK_STATUS)) {
            warn('could not link the shader program!')
            gl.deleteProgram(gl.program)
            gl.deleteProgram(vertexShader)
            gl.deleteProgram(fragmentShader)
            return false
        } else {
            // install program to current rendering state
            gl.useProgram(gl.program)
            return gl
        }
    }

    root.getGLprog = getGLprog

})(typeof module !== 'undefined' && module.exports ? module.exports : this)