type Dog = { bark: () => string; };

// TS2420: Class 'MyDog' incorrectly implements interface 'Dog'.
//   Property 'bark' is protected in type 'MyDog' but public in type 'Dog'.
class MyDog implements Dog {
  protected bark(): string {
    return 'Woff!';
  }
}

// TS2415: Class 'MyOtherDog' incorrectly extends base class 'MyDog'.
//   Property 'bark' is private in type 'MyOtherDog' but not in type 'MyDog'.
class MyOtherDog extends MyDog {
  private bark(): string {
    return 'Woff!';
  }
}
