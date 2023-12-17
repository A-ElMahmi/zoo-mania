class Button {
    constructor(img, centerX, centerY, w, h) {
        this.img = img;
        
        this.x = centerX;
        this.y = centerY;
        this.w = w;
        this.h = h;

        this.clicked = false;

        this.img.resize(this.w, this.h);
    }

    show() {
        push();
        imageMode(CENTER);

        if (this.clicked) {
            image(this.img, this.x, this.y, this.w * 0.95, this.h * 0.95);
        } else {
            image(this.img, this.x, this.y, this.w, this.h);
        }

        pop();
    }

    pressed() {
        if (this.intersectPoint(mouseX, mouseY)) {
            // console.log('Button pressed');
            
            this.clicked = true;
            return true;
        }
    }
    
    released() {
        if (this.clicked && this.intersectPoint(mouseX, mouseY)) {
            // console.log('Button released');
            clickSound.setVolume(0.5);
            clickSound.play();

            this.clicked = false;
            return true;
        }
    }

    intersectPoint(x, y) {
        return  x > this.x - (this.w / 2) && x < this.x + (this.w / 2) && 
                y > this.y - (this.h / 2) && y < this.y + (this.h / 2);
    }
}