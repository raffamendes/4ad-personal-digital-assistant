package com.rmendes.entity;

import java.util.ArrayList;
import java.util.List;

public class Character {
    public Long id;
    public String name;
    public String characterClass;
    public int level;
    public int lifePoints;
    public int maxLifePoints;
    public int attackBonus;
    public int defenseBonus;
    public int gold;
    public String equipment;
    public List<Spell> spells = new ArrayList<>();
    public String traits;
    public int clues;
    public int xp;
    public String notes;

    public Character() {}
}
