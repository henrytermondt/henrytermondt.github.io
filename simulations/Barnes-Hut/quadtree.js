const points = [];
class Point {
    constructor(index, x, y, vx=0, vy=0) {
        this.index = index;
        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;
        this.ax = 0;
        this.ay = 0;
    }
    update() {
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;

        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }
    addForce(dx, dy, m, r2) {
        /*
        F=mm/r2
        a=F/m=m/r2
        c=m/r3 what's wrong here?

        ax=a*cos(θ)=a*dx/r=m*dx/r3=cdx
        ay=a*sin(θ)=a*dy/r=m*dy/r3=cdy
        */
        const c = G * m / r2;
        this.ax += c * dx;
        this.ay += c * dy;
    }
}

const reconstructPoints = newPoints => {
    const len = points.length;
    for (let i = 0; i < len; i ++) {
        const index = (Math.random() * sw * sh | 0) * 4; 

        points[i].x  = newPoints[index    ];
        points[i].y  = newPoints[index + 1];
        points[i].vx = newPoints[index + 2];
        points[i].vy = newPoints[index + 3];
    }
};


class Quadrant {
    /*
    Winding order
    NW NE SW SE
    1 2
    3 4
    */
    constructor(x, y, width, layer, isRoot=false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.layer = layer;

        this.pointIndex = null;
        this.mass = 0;
        this.cx = null;
        this.cy = null;

        this.children = [];
        this.empty = true;
        this.hasPoint = false;
        this.subdivided = false;
        this.isLeaf = true;
        this.isRoot = isRoot;
    }
    outsideBounds(point) {
        return point.x < this.x || point.x >= this.x + this.width ||
               point.y < this.y || point.y >= this.y + this.width;
    }
    addPoint(point) { // Used for constructing the tree
        if (this.outsideBounds(point))
            return false; // Point not in quadrant, continue

        if (this.empty) { // First point in quadrant
            this.children[0] = point;
            this.hasPoint = true;
            this.empty = false;

            this.pointIndex = point.index;

            // Set center of mass to point
            this.mass = 1;
            this.cx = point.x;
            this.cy = point.y;

            return true; // Point added
        } else { // Must subdivide
            this.isLeaf = false;

            // Update center of mass
            this.mass ++;
            this.cx += (point.x - this.cx) / this.mass;
            this.cy += (point.y - this.cy) / this.mass;

            // Keep original first point
            let childPoint = null;
            if (this.children.length === 1) childPoint = this.children[0]; // Original point
            
            if (!this.subdivided) { // If not subdivided yet, add child quadrants
                this.subdivided = true;
                this.hasPoint = false;
                this.empty = false;

                this.pointIndex = point.index;

                const width = this.width * 0.5;
                this.children[0] = new Quadrant(this.x        , this.y        , width, this.layer + 1); // NW
                this.children[1] = new Quadrant(this.x + width, this.y        , width, this.layer + 1); // NE
                this.children[2] = new Quadrant(this.x        , this.y + width, width, this.layer + 1); // SW
                this.children[3] = new Quadrant(this.x + width, this.y + width, width, this.layer + 1); // SE
            }

            if (childPoint) { // Add original point back in
                for (const q of this.children) {
                    if (q.addPoint(childPoint)) break; // If point added, stop
                }
            }
            for (const q of this.children) { // Add new point
                if (q.addPoint(point)) break; // If added, stop
            }

            return true; // Point was successfully added
        }
    }
    addForce(point) {
        if (this.isRoot) { // Reset net acceleration
            point.ax = 0;
            point.ay = 0;
        }

        if (this.empty) return; // Contributes no force
        
        if (this.hasPoint) {
            if (point !== this.children[0]) { // If not itself
                const dx = this.children[0].x - point.x,
                    dy = this.children[0].y - point.y;
                if (dx !== 0 || dy !== 0) {
                    const r2 = dx * dx + dy * dy;
                    point.addForce(dx, dy, 1, r2);
                }
            }
        } else { // Has child quadrants
            const dx = this.cx - point.x,
                dy = this.cy - point.y;
            if (dx !== 0 || dy !== 0) {
                const r2 = dx * dx + dy * dy;
                if (this.width * this.width / r2 < theta * theta)
                    point.addForce(dx, dy, this.mass, r2); // Approximate
                else { // Recursively go through child quadrants
                    this.children[0].addForce(point);
                    this.children[1].addForce(point);
                    this.children[2].addForce(point);
                    this.children[3].addForce(point);
                }
            }
        }
    }
    render() {
        ctx.lineWidth = 0.1 / dim;
        ctx.strokeStyle = 'rgb(255, 255, 255, 0.5)';
        ctx.strokeRect(this.x, this.y, this.width, this.width);

        if (this.isLeaf) {
            if (this.children[0]) {
                const child = this.children[0];
                ctx.fillStyle = 'rgb(255, 255, 255, 1)';
                ctx.beginPath();
                ctx.arc(child.x, child.y, 0.1 / dim, 0, Math.PI * 2);
                ctx.closePath();
                // ctx.fill();
            }
        } else {
            this.children[0].render();
            this.children[1].render();
            this.children[2].render();
            this.children[3].render();
        }
    }
    reset() {
        this.children.length = 0;

        this.mass = 0;
        this.cx = null;
        this.cy = null;

        this.children = [];
        this.empty = true;
        this.hasPoint = false;
        this.subdivided = false;
        this.isLeaf = true;
    }
}

const root = new Quadrant(0, 0, 1, 0, true);
const constructTree = () => {
    root.reset();

    for (const p of points) {
        root.addPoint(p);
    }
};


let arrIndex = -8,
    qIndex = 0,
    endIndex = 0;
const tw = 100, th = 100;
const treeArr = new Float32Array(tw * th * 4);
const queue = [root];
const collapseTree = () => {
    queue[0] = root;
    queue.length = 1;

    arrIndex = qIndex = endIndex = 0;

    /*
    x, y, width, state (0=empty, 1=point, 2=quadrants)
    children/points (four indices)
    cx, cy, mass
    */
    while (queue.length !== 0) {
        const quadrant = queue.shift();
        
        treeArr[arrIndex    ] = quadrant.x;
        treeArr[arrIndex + 1] = quadrant.y;
        treeArr[arrIndex + 2] = quadrant.width;

        if (quadrant.empty) treeArr[arrIndex + 3] = 0; // Is empty
        else if (quadrant.hasPoint) {
            treeArr[arrIndex + 3] = 1; // Has points

            // 2nd pixel
            treeArr[arrIndex + 4] = quadrant.pointIndex;
        } else {
            treeArr[arrIndex + 3] = 2; // Has quadrants

            // 2nd pixel (sets where to look for children)
            treeArr[arrIndex + 4] = (qIndex + 1) * 3;
            treeArr[arrIndex + 5] = (qIndex + 2) * 3;
            treeArr[arrIndex + 6] = (qIndex + 3) * 3;
            treeArr[arrIndex + 7] = (qIndex + 4) * 3;

            queue.push(
                quadrant.children[0], 
                quadrant.children[1], 
                quadrant.children[2], 
                quadrant.children[3],
            );

            qIndex += 4; // Move up by four quadrants
        }

        treeArr[arrIndex + 8 ] = quadrant.cx;
        treeArr[arrIndex + 9 ] = quadrant.cy;
        treeArr[arrIndex + 10] = quadrant.mass;

        arrIndex += 12;
    }

    endIndex = arrIndex;
    // console.log(endIndex / 4);
};

const addGalaxy = (gx, gy) => {
    const maxr = 0.15;
    for (let i = 0; i < 100; i ++) {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * maxr; // Use sqrt to make uniform distribution
        const x = Math.cos(theta) * r + gx,
            y = Math.sin(theta) * r + gy;

        points.push(
            new Point(
                i,
                x,
                y,
                Math.cos(theta + Math.PI * 0.5) * 0.004,
                Math.sin(theta + Math.PI * 0.5) * 0.004
            )
        );
    }
};