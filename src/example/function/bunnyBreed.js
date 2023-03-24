#!/usr/bin/env node

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRabbit() {
  const rabbits = [
    `
      (\\__/)
      (o'.'o)
      (")_(")
    `,
    `
      (\\_/)
      (* *)
      c(")(")
    `,
    `
      (\_/)
      \ @ @ /
      =(m=)
    `,
    `
      ((\ /))
      \\=°^°=/
       ('')('')
    `,
    `
      (\       /)
      ( \_ _/ )
      /       \\
     (         )
    `,    
    `
      (\_/)
      (O.o)
      (> <)
    `,
    `
      (\_/)
      (^.^)
      c(")(")
    `,
    `
      (\__/) ||
      (•ㅅ•) ||
      / 　 づ
    `,
    `
      (\__/)  |​| 
      (•ㅅ•) / \\
      J|   |_|
    `,
    `
      (\__/) || 
      (•ㅅ•) || 
      /    づ
    `  
  ];
  
  const randomIndex = generateRandomNumber(0, rabbits.length - 1);
  return rabbits[randomIndex];
}

function bunnyBreed() {
  const numberOfRabbits = generateRandomNumber(1, 10);
  let result = '';
  
  for (let i = 0; i < numberOfRabbits; i++) {
    result += generateRabbit() + '\n\n';
  }
  
  return result.trim();
}

console.log(bunnyBreed());
