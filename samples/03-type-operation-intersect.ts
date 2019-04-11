type Person = { name: string } & { age: number };

interface GroupMember {
  groupId: number;
  addToGroup: (groupId: number) => void;
}
type PersonInGroup = Person & GroupMember;

const person: Person = { name: 'John', age: 32 };

/*
 * All the members of the class must be implemented.
 * Otherwise compiler emits something like
 *   TS2420: Class 'Student' incorrectly implements interface 'PersonInGroup'.
 *     Type 'Student' is not assignable to type 'GroupMember'.
 *       Property 'groupId' is missing in type 'Student' but required in type 'GroupMember'.
 */
class Student implements PersonInGroup {
  public name: string;
  public age: number;
  public groupId: number = -1;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  public addToGroup(groupId: number) {
    this.groupId = groupId;
  }
}
