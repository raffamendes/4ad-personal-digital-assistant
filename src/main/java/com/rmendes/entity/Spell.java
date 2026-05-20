package com.rmendes.entity;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class Spell {
    public String name;
    public int maxUses;
    public int currentUses;

    public Spell() {}
    
    public Spell(String name, int maxUses) {
        this.name = name;
        this.maxUses = maxUses;
        this.currentUses = maxUses;
    }
}
