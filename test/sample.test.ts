function sum(x:number,y:number):number{
    return x+y
}

test("sample sum test", () =>{
    expect(sum(1,2)).toBe(3)
})
