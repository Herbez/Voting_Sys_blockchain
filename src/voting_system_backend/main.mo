import Array "mo:base/Array";

actor Voting {
    type Voter = {
        id : Text;
        hasVoted : Bool;
    };

    type Candidate = {
        name : Text;
        votes : Nat;
    };

    var voters : [Voter] = [];
    var candidates : [Candidate] = [
        { name = "Candidate A"; votes = 0 },
        { name = "Candidate B"; votes = 0 }
    ];

    public shared({caller}) func registerVoter(id: Text) : async Bool {
        if (not Array.some(voters, func(v : Voter) : Bool { v.id == id })) {
            voters := Array.append(voters, [{ id = id; hasVoted = false }]);
            return true;
        } else {
            return false;
        }
    };

    public shared({caller}) func vote(voterId: Text, candidateName: Text) : async Bool {
        let voterIndex = Array.indexOfOpt(voters, func(v : Voter) : Bool { v.id == voterId }, func(x : Voter, y : Voter) : Bool { x == y });
        switch (voterIndex) {
            case (null) {
                return false; // Voter not found
            };
            case (?index) {
                if (voters[index].hasVoted) {
                    return false; // Voter already voted
                } else {
                    let candidateIndex = Array.indexOfOpt(candidates, func(c : Candidate) : Bool { c.name == candidateName }, func(x : Candidate, y : Candidate) : Bool { x == y });
                    switch (candidateIndex) {
                        case (null) {
                            return false; // Candidate not found
                        };
                        case (?candidateIndex) {
                            voters[index].hasVoted := true;
                            candidates[candidateIndex].votes += 1;
                            return true; // Vote successful
                        };
                    };
                };
            };
        };
    };

    public query func getResults() : async [Candidate] {
        return candidates;
    };
};