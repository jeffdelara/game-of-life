class Game 
{
    constructor(context, canvas)
    {
        this.ctx = context;
        this.canvas = canvas;
        this.cell_width = 10;
        this.grid = [];
        this.grid_next_round = [];

        this.width = 1200;
        this.height = 800;
        this.STATE = {
            PLACING: 0, 
            LIVING: 1
        }
        this.game_state = this.STATE.TITLE;
        this.counter = 0;

        this.mouseX = 0;
        this.mouseY = 0;

        this.row = null;
        this.col = null;

        this.color = "#1e3d59";
    }

    init()
    {
        this.setCanvas(this.width, this.height);
        this.grid = [];
        this.grid = this.createArray({width: this.width, height: this.height});
        this.grid_next_round = [];
        this.grid_next_round = this.createArray({width: this.width, height: this.height});
        this.game_state = this.STATE.PLACING;
        this.drawGridLines();
    }

    update()
    {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

        switch(this.game_state) 
        {
            
            case this.STATE.PLACING: 
                const coor = this.getArrayPosition();
                ctx.fillStyle = this.color;
                ctx.fillRect(coor.col * this.cell_width, coor.row * this.cell_width, this.cell_width, this.cell_width);
                break;

            case this.STATE.LIVING:
                // check neighbors
                this.analyzeNeighbors();

                // grid <- grid_next_round
                this.refreshGrid();
                this.copyGrid(); 

                // grid_next_round refreshes
                this.refreshNextGrid();
                break;
        }
    }

    drawMap()
    {
        const y_length = this.grid.length;
        const x_length = this.grid[0].length;
        
        for(let i = 0; i < y_length; i++)
        {
            for(let j = 0; j < x_length; j++)
            {
                if(this.grid[i][j] === 1) 
                {
                    this.ctx.fillStyle = this.color;
                    this.ctx.fillRect(j * this.cell_width, i * this.cell_width, this.cell_width, this.cell_width);
                }
            }
        }
    }

    draw()
    {
        this.drawMap();
        // grid lines
        this.drawGridLines();
    }

    refreshNextGrid()
    {
        this.grid_next_round = [];
        this.grid_next_round = this.createArray({width: this.width, height: this.height});
    }

    refreshGrid()
    {
        this.grid = [];
        this.grid = this.createArray({width: this.width, height: this.height});
    }

    copyGrid()
    {
        const y_length = this.grid_next_round.length;
        const x_length = this.grid_next_round[0].length;

        for(let i = 0; i < y_length; i++)
        {
            for(let j = 0; j < x_length; j++)
            {
                this.grid[i][j] = this.grid_next_round[i][j];
            }
        }
    }

    createSpaceShip(row, col)
    {
        this.grid[row][col] = 0;
        this.grid[row - 1][col] = 1;
        this.grid[row][col + 1] = 1;
        this.grid[row + 1][col + 1] = 1;
        this.grid[row + 1][col] = 1;
        this.grid[row + 1][col - 1] = 1;
    }

    analyzeNeighbors()
    {
        const y_length = this.grid.length;
        const x_length = this.grid[0].length;
        
        for(let i = 0; i < y_length; i++)
        {
            for(let j = 0; j < x_length; j++)
            {
                this.aliveOrDead(i, j);
            }
        }
    }

    getCell(row, col)
    {
        if(row < 0) row = this.grid.length - 1;
        if(row > this.grid.length - 1) row = 0;
        if(col < 0)  col = this.grid[0].length - 1;
        if(col > this.grid[0].length - 1) col = 0;
        
        return this.grid[row][col];
    }

    aliveOrDead(row, col)
    {
        let neighbors = 0;

        const cell_states = {
            0: 'dead',
            1: 'alive'
        }

        const cell = this.grid[row][col];

        // top 
        neighbors += this.getCell(row - 1, col);
        // this.grid[row - 1][col];

        // bottom 
        neighbors += this.getCell(row + 1, col);
        // this.grid[row + 1][col];

        // left
        neighbors += this.getCell(row, col - 1);
        // this.grid[row][col - 1]; 

        // right 
        neighbors += this.getCell(row, col + 1);
        // this.grid[row][col + 1];

        // top left
        neighbors += this.getCell(row - 1, col - 1);
        // this.grid[row - 1][col - 1];

        // top right
        neighbors += this.getCell(row - 1, col + 1);
        // this.grid[row - 1][col + 1];

        // bottom left 
        neighbors += this.getCell(row + 1, col - 1);
        // this.grid[row + 1][col - 1];

        // bottom right
        neighbors += this.getCell(row + 1, col + 1); 
        // this.grid[row + 1][col + 1];

        if(cell_states[cell] === 'alive')
        {
            if(neighbors === 0 || neighbors === 1)
            {
                this.grid_next_round[row][col] = 0;
            }

            if(neighbors === 2 || neighbors === 3)
            {
                this.grid_next_round[row][col] = 1;
            }

            if(neighbors > 3)
            {
                this.grid_next_round[row][col] = 0;
            }
        }

        if(cell_states[cell] === 'dead')
        {
            if(neighbors === 3)
            {
                this.grid_next_round[row][col] = 1;
            }
        }
    }

    getMousePosition(event)
    {
        const rect = canvas.getBoundingClientRect();
        
        this.mouseX = event.clientX - rect.left;
        this.mouseY = event.clientY - rect.top;
        
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }

    getMousePositionToMapCoor(event)
    {
        const rect = canvas.getBoundingClientRect();

        const row = parseInt(  (event.clientY - rect.top) / this.cell_width ); 
        const col = parseInt( (event.clientX - rect.left) / this.cell_width)

        this.grid[row][col] = 1;
    }

    getArrayPosition()
    {
        return {
            row: parseInt(this.mouseY / this.cell_width),
            col: parseInt(this.mouseX / this.cell_width)
        }
    }

    

    clear()
    {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    setCanvas(width, height)
    {
        canvas.width = width;
        canvas.height = height;
    }

    createArray(dimension)
    {
        let array = [];
        let rows = parseInt(dimension.height / this.cell_width);
        let cols = parseInt(dimension.width / this.cell_width);

        for(let row = 0; row < rows; row++)
        {
            let row_array = [];
            for(let col = 0; col < cols; col++)
            {
                row_array.push(0);
            }
            array.push(row_array);
        }

        return array;
    }

    drawGridLines()
    {
        const ctx = this.ctx;

        const length = this.grid[0].length;

        for(let i = 0; i <= length; i++)
        {
            ctx.strokeStyle = "#EEEEEE";
            ctx.beginPath();
            ctx.moveTo(i * this.cell_width, 0);
            ctx.lineTo(i * this.cell_width, this.height);
            ctx.stroke();
        }

        const width = this.grid.length;

        for(let i = 0; i <= width; i++)
        {
            ctx.beginPath();
            ctx.moveTo(0, this.cell_width * i);
            ctx.lineTo(this.width, this.cell_width * i);
            ctx.stroke();
        }
    }

}