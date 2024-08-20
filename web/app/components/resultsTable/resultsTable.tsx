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
    return (<div className="w-5/6 flex justify-center h-full flex-wrap p-1">
        {cards.map(card =>
            (<Card extraClassNames={'mx-5'} key={card.id} title={card.title} description={card.description} owner={card.owner} age={card.age} />)
        )}
    </div>)
}