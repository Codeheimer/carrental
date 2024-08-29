import Card from "../card/card";

const cards = [
    {
        id: 1,
        title: 'foo',
        description: 'foo',
        owner: 'FooBar',
        age: '3'
    }, {
        id: 2,
        title: 'boo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a magna scelerisque, aliquet nunc in, bibendum velit. Nullam vitae gravida lorem, quis efficitur libero.',
        owner: 'FooBar',
        age: '3'
    }, {
        id: 3,
        title: 'coo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a magna scelerisque, aliquet nunc in, bibendum velit. Nullam vitae gravida lorem, quis efficitur libero.',
        owner: 'FooBar',
        age: '3'
    }, {
        id: 2,
        title: 'boo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a magna scelerisque, aliquet nunc in, bibendum velit. Nullam vitae gravida lorem, quis efficitur libero.',
        owner: 'FooBar',
        age: '3'
    }, {
        id: 3,
        title: 'coo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a magna scelerisque, aliquet nunc in, bibendum velit. Nullam vitae gravida lorem, quis efficitur libero.',
        owner: 'FooBar',
        age: '3'
    }, {
        id: 2,
        title: 'boo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a magna scelerisque, aliquet nunc in, bibendum velit. Nullam vitae gravida lorem, quis efficitur libero.',
        owner: 'FooBar',
        age: '3'
    }, {
        id: 3,
        title: 'coo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a magna scelerisque, aliquet nunc in, bibendum velit. Nullam vitae gravida lorem, quis efficitur libero.',
        owner: 'FooBar',
        age: '3'
    }, {
        id: 2,
        title: 'boo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a magna scelerisque, aliquet nunc in, bibendum velit. Nullam vitae gravida lorem, quis efficitur libero.',
        owner: 'FooBar',
        age: '3'
    }, {
        id: 3,
        title: 'coo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a magna scelerisque, aliquet nunc in, bibendum velit. Nullam vitae gravida lorem, quis efficitur libero.',
        owner: 'FooBar',
        age: '3'
    }, {
        id: 2,
        title: 'boo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a magna scelerisque, aliquet nunc in, bibendum velit. Nullam vitae gravida lorem, quis efficitur libero.',
        owner: 'FooBar',
        age: '3'
    }, {
        id: 3,
        title: 'coo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a magna scelerisque, aliquet nunc in, bibendum velit. Nullam vitae gravida lorem, quis efficitur libero.',
        owner: 'FooBar',
        age: '3'
    }, {
        id: 2,
        title: 'boo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a magna scelerisque, aliquet nunc in, bibendum velit. Nullam vitae gravida lorem, quis efficitur libero.',
        owner: 'FooBar',
        age: '3'
    }, {
        id: 3,
        title: 'coo',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a magna scelerisque, aliquet nunc in, bibendum velit. Nullam vitae gravida lorem, quis efficitur libero.',
        owner: 'FooBar',
        age: '3'
    }
];

export default function ResultsTable() {
    /*

    <div className="w-5/6 m-6 flex justify-center h-full flex-wrap p-1">
        
    </div>
    */
    return (
    <div className="m-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {cards.map(card =>
            (<Card key={card.id} title={card.title} description={card.description} owner={card.owner} age={card.age} />)
        )}
      </div>)
}