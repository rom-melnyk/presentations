type Dog = { bark: () => string; };

class MyDog implements Dog {
  protected bark(): string {
    return 'Woff!';
  }
}

class MyOtherDog extends MyDog {
  private bark(): string {
    return 'Woff!';
  }
}
