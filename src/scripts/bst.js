import Circle from "./circle";
import Arrow from "./arrow";

class Node {
  constructor(value) {
    this.value = value;
    this.level = 0;
    this.xpos = 750;
    this.ypos = 75;
    this.left = null;
    this.right = null;
    this.circle = null;
    this.arrow = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
    this.circles = [];
  }

  insert(value) {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const newNode = new Node(value);

    if (!this.root) {
      newNode.level = 0;
      this.root = newNode;
      newNode.circle = new Circle(context, newNode);
      this.circles.push({ circle: newNode.circle });
      return;
    }

    let current = this.root;

    while (true) {
      if (value === current.value) {
        console.log("This value already exists!");
        return undefined; //avoid duplicates
      }

      newNode.level += 1;

      if (value < current.value) {
        newNode.xpos -= 300 / newNode.level;

        if (!current.left) {
          current.left = newNode;
          newNode.circle = new Circle(context, newNode);
          newNode.arrow = new Arrow(context, current, current.left);
          this.circles.push({ circle: newNode.circle, arrow: newNode.arrow });
          return;
        } else {
          current = current.left;
        }
      } else {
        newNode.xpos += 300 / newNode.level;

        if (!current.right) {
          current.right = newNode;
          newNode.circle = new Circle(context, newNode);
          newNode.arrow = new Arrow(context, current, current.right);
          this.circles.push({ circle: newNode.circle, arrow: newNode.arrow });
          return;
        } else {
          current = current.right;
        }
      }
    }
  }

  async remove(value) {
    let current = this.root;
    let previous = null;
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    if (current.value === value) {
      if (previous === null) {
        let minRightChild = current.right;

        while (minRightChild.left) {
          minRightChild = minRightChild.left;
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
        this.root.value = minRightChild.value;
        this.root.circle.value = this.root.value;
        this.circles[0]["circle"] = this.root.circle;
        this.reset();
      }
    }
  }

  async search(value) {
    console.log("searching...");

    let current = this.root;
    while (current) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (current.arrow) {
        current.arrow.update();
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      current.circle.update();
      if (current.value === value) {
        current.circle.found();
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.reset();
        return true;
      } else if (current.value > value) {
        current = current.left;
      } else if (current.value < value) {
        current = current.right;
      }
    }
    return false;
  }

  reset() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, 1500, 700);
    this.circles.forEach((circle) => {
      circle["circle"].drawNode();
      if (circle["arrow"]) {
        circle["arrow"].drawLine();
      }
    });
  }
}

export { Arrow, Circle, Node, BinarySearchTree };