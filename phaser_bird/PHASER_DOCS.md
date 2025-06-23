# Phaser 3 Documentation

Official documentation: https://phaser.io/docs/3.55.2

## Key Concepts
- **Game Config**: Set up width, height, physics, scenes.
- **Scenes**: Main structure for game logic (preload, create, update).
- **Physics**: Arcade physics for simple collision and movement.
- **Sprites/Shapes**: Use `this.add.rectangle` for rectangles.
- **Groups**: Manage multiple objects (like pipes).
- **Input**: Keyboard and pointer events.

## Useful Links
- [Phaser 3 API Docs](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 Examples](https://phaser.io/examples)

## Common Methods
- `this.add.rectangle(x, y, w, h, color)`
- `this.physics.add.existing(obj)`
- `this.physics.add.group()`
- `this.input.on('pointerdown', cb, ctx)`
- `this.input.keyboard.on('keydown-SPACE', cb, ctx)`
- `this.physics.add.overlap(obj1, obj2, cb, null, ctx)`

See the links above for more details and examples.
