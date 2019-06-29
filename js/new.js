
class myTooltipC {
    constructor (boxId, config = {}) {
        if (!boxId) throw Error('boxId为必传项')
        this.boxId = boxId
        this.config = {
            priority: 'top',        // 默认在点上方OR下方（top/bottom）
            partition: 1.4,         // 左右分割比例
            lineColor: 'rgba(253, 129, 91, 0.8)',      // 引导线颜色
            offset: [5, 5],
            L1: {
                time: 0.3,          // L1动画时长(单位s)
                long: 40            // L1长度
            },
            L2: {
                time: 0.3,
                long: 40
            },
            text: {
                time: 0.5,
                font: '14px Arial',
                color: '#fff',
                padding: [10, 10],
                width: 120,
                height: 60,
                lineHeight: 24,
                backgroundColor: 'rgba(50, 50, 50, 0.5)',
                borderColor: 'rgba(253, 129, 91, 1)',
                borderWidth: 1,
                angle: {
                    width: 2,
                    long: 15
                }
            }
        }
        _.merge(this.config, config, {
            left: false,
            top: false
        });
		this.fontSize = (this.config.text.font.match(/^\d+/) || [14])[0];
		this.textLength = parseInt((this.config.text.width - (this.config.text.padding[1] * 2) - this.config.text.borderWidth * 2) / this.fontSize, 10);
		this.textWidth =this.config.text.width;
    }
    getPosOrSize (type, point) {
        let x1 = this.config.L1.long * Math.sin(Math.PI / 4);
        let width = x1 + this.config.L2.long + this.config.text.width
        let height = x1 + this.config.text.height / 2
        if (type === 'size') {
            this.config.width = width
            this.config.height = height
            return {
                width,
                height
            }
        } else {
            let box = document.getElementById(this.boxId)
            let bw = box.offsetWidth
            let bh = box.offsetHeight
            let x = point[0]
            let y = point[1]
            this.config.left = false
            if (x + width >= bw / this.config.partition) {
                x = x - width - this.config.offset[0]
                this.config.left = true
            }
            if (this.config.priority === 'top') {
                // L1向上
                this.config.top = true
                y = y - height - this.config.offset[0]
                if (y <= 0) {
                    y = point[1]
                    this.config.top = false
                }
                return [x, y]
            } else {
                this.config.top = false
                if (y + height >= bh) {
                    y = y - height - this.config.offset[0]
                    this.config.top = true
                }
                return [x, y]
            }
        }
    }
    getTooltipDom (text) {
        if (!text) throw Error('text为必传项')
        return this.clickTrigger(text)
    }
    createTooltip (text) {
        let me = this;
		let length = 0;
		text.split('\n').forEach(_ => length = Math.max(length, _.length));
		if(length > me.textLength){
			let width = length * me.fontSize + me.config.text.padding[1] * 2 + me.config.text.borderWidth * 2;
			me.config.text.width = width;
		}else{
			me.config.text.width = me.textWidth;
		}
        setTimeout($ => {		
            me.t = new createTooltip('tCanvas', me.config, text)
        }, 0)
    }
    clickTrigger (text) {
        this.createTooltip(text)
        let size = this.getPosOrSize('size');
        return `<canvas id="tCanvas" width="${size.width}" height="${size.height}"></canvas>`
    }
}
