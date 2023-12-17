// Click and Drag an object
// Daniel Shiffman <http://www.shiffman.net>

class Label {
    constructor(name, x, y, snapX, snapY) {

        this.dragging = false; // Is the object being dragged?
        this.rollover = false; // Is the mouse over the ellipse?

        this.name = name;
        this.x = x;
        this.y = y;
        this.snapX = snapX;
        this.snapY = snapY;

        this.snapped = false;
        this.correct = false;
        this.hpTextShown = false;

        this.textColor = color(255);
        this.textAlpha = 255;

        // this.w = 165 * 0.75;
        // this.h = 70 * 0.75;
        this.w = 211 * 0.7;
        this.h = 69 * 0.7;
        sign.resize(this.w, this.h);
    }

    over() {
        // Is mouse over object
        if (this.intersectPoint(mouseX, mouseY)) {
            this.rollover = true;
        } else {
            this.rollover = false;
        }
    }

    update() {
        // Adjust location if being dragged
        if (this.dragging) {
            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;
        }

        this.x = constrain(this.x, 0 + (this.w / 2), width - (this.w / 2));
        this.y = constrain(this.y, 0 + (this.h / 2), height - (this.h / 2));

        // if (this.snapped && this.correct && !this.hpTextShown) {
        //     this.hpText = new HpText(this.x + (this.w / 2) + 5, this.y, true);
        //     this.hpTextShown = true;
        // } else if (this.snapped && !this.correct && !this.hpTextShown) {
        //     this.hpText = new HpText(this.x + (this.w / 2) + 5, this.y, false);
        //     this.hpTextShown = true;
        // }
        
        if (this.snapped && !this.hpTextShown) {
            this.hpTextShown = true;
            this.hpText = new HpText(this.x + (this.w / 2) + 5, this.y, this.correct);
        }

        if (this.hpTextShown) {
            this.hpText.update();

            if (!this.snapped) {
                this.hpTextShown = false;
            }
        }
    }

    snap(points) {
        if (this.dragging) return;

        let buffer = 70;

        for (let i = 0; i < points.length; i++) {
            if (points[i].x > this.x - buffer && points[i].x < this.x + buffer && 
                points[i].y > this.y - (buffer * 0.5) && points[i].y < this.y + (buffer * 1.5)) {
                    this.x = lerp(this.x, points[i].x, 0.2);
                    this.y = lerp(this.y, points[i].y, 0.2);
                    
                    this.snapped = false;

                    if (abs(this.x - points[i].x) < 3 && abs(this.y - points[i].y) < 3) {
                        // console.log('Snapped');
                        this.snapped = true;
                        this.checkAnswer();
                    }
                    
                    return true;
            }
        }

        this.snapped = false;
        this.textColor = color(255, 255, 255);
    }

    checkAnswer() {
        if (!this.snapped) return;

        if (abs(this.x - this.snapX) < 3 && abs(this.y - this.snapY) < 3) {
            this.textColor = color(0, 255, 0);
            this.correct = true;
            return true;
        } else {
            this.textColor = color(255, 0, 0);
            this.correct = false;
            return false;
        }
    }

    show() {
        noStroke();

        // Different fill based on state
        // if (this.dragging) {
        //     fill(50);
        // } else if (this.rollover) {
        //     fill(100);
        // } else {
        //     fill(175);
        // }
        
        // fill(255);
        // rect(this.x, this.y, this.w, this.h, 15);
        push();
        imageMode(CENTER);
        image(sign, this.x, this.y);
        pop();

        push();
        fill(this.textColor);
        // textFont(signFont);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        textSize(16);
        text(this.name, this.x, this.y + 2);
        pop();
        
        // if (this.correct) {
        //     push();
        //     this.textAlpha = lerp(this.textAlpha, 0, 0.02);
        //     fill(0, 255, 0, this.textAlpha);
        //     textStyle(NORMAL);
        //     textSize(12);
        //     text('+10hp', this.x + (this.w / 2) + 10, this.y);
        //     pop();
        // }

        if (this.hpTextShown) {
            this.hpText.show();
        }
    }

    pressed() {
        if (this.snapped && this.correct) return;
        
        // Did I click on the rectangle?
        if (this.intersectPoint(mouseX, mouseY)) {
            this.dragging = true;
            // If so, keep track of relative location of click to corner of rectangle
            this.offsetX = this.x - mouseX;
            this.offsetY = this.y - mouseY;
            
            return true;
        }
    }
    
    released() {
        // Quit dragging
        this.dragging = false;
    }

    intersectPoint(x, y) {
        return  x > this.x - (this.w / 2) && x < this.x + (this.w / 2) && 
                y > this.y - (this.h / 2) && y < this.y + (this.h / 2);
    }
}


class HpText {
    constructor(x, y, correct) {
        this.x = x;
        this.y = y;
        this.correct = correct;

        if (this.correct) {
            this.text = '+70hp';
            health += 70;
            successSound.setVolume(0.5);
            successSound.play();
        } else {
            this.text = '-40hp';
            health -= 40;
            errorSound.setVolume(0.1);
            errorSound.play();
        }

        this.colorAlpha = 255;
        this.final_y = y + 20;
    }

    update() {
        this.colorAlpha = lerp(this.colorAlpha, 0, 0.02);
        this.y = lerp(this.y, this.final_y, 0.01);
    }

    show() {
        push();

        if (this.correct) {
            fill(0, 255, 0, this.colorAlpha);
        } else {
            fill(255, 0, 0, this.colorAlpha);
        }
        
        textStyle(NORMAL);
        textSize(12);
        text(this.text, this.x, this.y);
        pop();
    }

    isDead() {
        return this.colorAlpha <= 1;
    }
}