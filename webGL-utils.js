(function(root) {

    /**
     * log util
     */
    function warn (str) {
        !!console.warn ? console.warn(str) : console.log(str)
    }

    /**
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
     * @param {String} type - can be 'vertex' or 'fragment'
     * @param {String} source
     * @return {GL_SHADER}
     * @protected
     */
    function compileShader(type, source) {
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
     * @param {String} fragmentShader - shader source
     * @param {String} vertexShader - shader source
     * @return {GL_PROGRAM}
     */
    function getGLprog(fragmentShader, vertexShader) {
        if (!glExists()) return warn('Can\'t get GL context!')
        if (!fragmentShader) return warn('fragmentShader was not defined')
        if (!vertexShader) return warn('vertexShader was not defined')

        var program = gl.createProgram()
        gl.attachShader(program, compileShader('vertex', vertexShader))
        gl.attachShader(program, compileShader('fragment', fragmentShader))
        gl.linkProgram(program)

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            warn('could not link the shader program!')
            gl.deleteProgram(program)
            gl.deleteProgram(vertexShader)
            gl.deleteProgram(fragmentShader)
            return false
        } else {
            return program
        }
    }

    root.getGLprog = getGLprog

})(typeof module !== 'undefined' && module.exports ? module.exports : this)